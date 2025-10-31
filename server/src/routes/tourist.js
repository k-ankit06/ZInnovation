import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import TouristProfile from '../models/Touristprofile.js';
import User from '../models/User.js';
import Alert from '../models/Alert.js';
import { canonicalizeTourist } from '../utils/hash.js';
import { asyncWrap } from '../utils/error.js';
import { v4 as uuid } from 'uuid';
import { sendTouristProfileCompletedEmail, sendSafetyAlertEmail } from '../services/emailService.js';
import { touristBlockchain } from '../blockchain/Blockchain.js';

const router = express.Router();

function genTouristId() {
  return `TID-${Date.now().toString().slice(-6)}-${uuid().slice(0, 4).toUpperCase()}`;
}

router.post('/register', requireAuth, requireRole('tourist'), asyncWrap(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ ok: false, message: 'User not found' });

  const body = req.body || {};
  
  
  const profile = new TouristProfile({ userId: user._id });

  Object.assign(profile, {
    fullName: body.fullName,
    email: user.email,
    phone: body.phone || user.phone,
    touristType: body.touristType,
    country: body.country,
    passportNumber: body.passportNumber,
    aadhaarNumber: body.aadhaarNumber,
    dateOfBirth: body.dateOfBirth,
    gender: body.gender,
    nationality: body.nationality,
    address: body.address,
    emergencyContactName: body.emergencyContactName,
    emergencyContactPhone: body.emergencyContactPhone,
    emergencyContactRelation: body.emergencyContactRelation,
    hotelName: body.hotelName,
    hotelAddress: body.hotelAddress,
    checkInDate: body.checkInDate,
    checkOutDate: body.checkOutDate,
    purposeOfVisit: body.purposeOfVisit,
    bloodGroup: body.bloodGroup,
    medicalConditions: body.medicalConditions,
    allergies: body.allergies,
    travelInsurance: body.travelInsurance,
    insuranceProvider: body.insuranceProvider,
    group: Array.isArray(body.group) ? body.group : []
  });

  profile.touristId = genTouristId();

  const { canonical, idHash } = canonicalizeTourist({
    fullName: profile.fullName,
    email: user.email,
    phone: profile.phone,
    touristType: profile.touristType,
    country: profile.country,
    passportNumber: profile.passportNumber,
    aadhaarNumber: profile.aadhaarNumber,
    dateOfBirth: profile.dateOfBirth
  });

  profile.canonicalPayload = canonical;
  profile.idHash = idHash;
  profile.isRegistered = true;

  await profile.save();

  
  const blockchainData = {
    touristId: profile.touristId,
    fullName: profile.fullName,
    email: user.email,
    touristType: profile.touristType,
    country: profile.country,
    passportNumber: profile.passportNumber,
    aadhaarNumber: profile.aadhaarNumber,
    checkInDate: profile.checkInDate,
    checkOutDate: profile.checkOutDate,
    idHash: profile.idHash,
    timestamp: Date.now(),
    action: 'CARD_CREATED'
  };
  
  const block = touristBlockchain.addBlock(blockchainData);
  console.log('✅ Tourist card added to blockchain:', block.hash);

  await sendTouristProfileCompletedEmail({ user, profile });

  return res.json({
    ok: true,
    data: {
      touristId: profile.touristId,
      idHash: profile.idHash,
      isRegistered: profile.isRegistered,
      blockchain: {
        blockHash: block.hash,
        blockIndex: block.index,
        verified: true
      }
    }
  });
}));


router.get('/me', requireAuth, requireRole('tourist'), asyncWrap(async (req, res) => {
  const profiles = await TouristProfile.find({ 
    userId: req.user.id, 
    isDeleted: false 
  }).lean().sort({ createdAt: -1 });
  
  if (!profiles || profiles.length === 0) {
    return res.json({ ok: true, data: { cards: [], isRegistered: false } });
  }
  
  const cards = profiles.map(p => ({ ...p, id: p._id }));
  res.json({ ok: true, data: { cards, isRegistered: true } });
}));


router.delete('/me/:touristId', requireAuth, requireRole('tourist'), asyncWrap(async (req, res) => {
  const touristId = req.params.touristId;
  const profile = await TouristProfile.findOne({ 
    touristId, 
    userId: req.user.id 
  });
  
  if (!profile) {
    return res.status(404).json({ ok: false, message: 'Card not found' });
  }
  
  // Soft delete
  profile.isDeleted = true;
  await profile.save();
  
  res.json({ ok: true, message: 'Card deleted successfully' });
}));

router.get('/cards', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const search = req.query.search || '';
  const query = {};
  
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { touristId: { $regex: search, $options: 'i' } },
      { passportNumber: { $regex: search, $options: 'i' } },
      { aadhaarNumber: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  const profiles = await TouristProfile.find(query).lean();
  const cards = profiles.map(p => ({
    id: p.touristId,
    name: p.fullName,
    country: p.country,
    passport: p.passportNumber,
    aadhaar: p.aadhaarNumber,
    touristType: p.touristType,
    phone: p.phone,
    email: p.email,
    emergencyContactName: p.emergencyContactName,
    emergencyContact: p.emergencyContactPhone,
    checkIn: p.checkInDate,
    checkOut: p.checkOutDate,
    hotelName: p.hotelName,
    hotelAddress: p.hotelAddress,
    group: p.group || [],
    status: 'Active',
    verified: true,
    currentLocation: p.hotelName || 'Not specified',
    safetyScore: Math.floor(Math.random() * 31) + 70
  }));
  
  res.json({ ok: true, data: cards });
}));


router.delete('/cards/:id', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const touristId = req.params.id;
  const result = await TouristProfile.findOneAndDelete({ touristId });
  
  if (!result) {
    return res.status(404).json({ ok: false, message: 'Tourist not found' });
  }
  
  res.json({ ok: true, message: 'Tourist card removed successfully' });
}));

// 🚨 SEND ALERT TO TOURIST
router.post('/alert/:touristId', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const touristId = req.params.touristId;
  const { message, alertType } = req.body;
  
  // Find tourist profile
  const profile = await TouristProfile.findOne({ touristId });
  
  if (!profile) {
    return res.status(404).json({ ok: false, message: 'Tourist not found' });
  }
  
  // Find user
  const user = await User.findById(profile.userId);
  
  if (!user) {
    return res.status(404).json({ ok: false, message: 'User not found' });
  }
  
  // Save alert to database
  const alert = new Alert({
    touristId,
    userId: user._id,
    message: message || 'You have been marked as UNSAFE by authorities. Please contact emergency services immediately.',
    alertType: alertType || 'Safety Warning',
    severity: 'critical',
    sentBy: req.user.id
  });
  
  await alert.save();
  
  // Send dedicated safety alert email
  try {
    await sendSafetyAlertEmail({
      user,
      profile,
      message: message || 'You have been marked as UNSAFE by authorities. Please take immediate action and contact emergency services if needed.',
      alertType: alertType || 'CRITICAL SAFETY WARNING'
    });
  } catch (emailErr) {
    console.error('Email send failed:', emailErr);
  }
  
  res.json({
    ok: true,
    message: 'Alert sent successfully',
    data: {
      touristId,
      email: user.email,
      name: profile.fullName,
      alertSent: true,
      timestamp: new Date()
    }
  });
}));

// 📬 GET ALERTS FOR TOURIST
router.get('/alerts', requireAuth, requireRole('tourist'), asyncWrap(async (req, res) => {
  const alerts = await Alert.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  
  res.json({
    ok: true,
    data: {
      alerts,
      unreadCount: alerts.filter(a => !a.isRead).length
    }
  });
}));

// ✅ MARK ALERT AS READ
router.patch('/alerts/:alertId/read', requireAuth, requireRole('tourist'), asyncWrap(async (req, res) => {
  const alert = await Alert.findOne({ _id: req.params.alertId, userId: req.user.id });
  
  if (!alert) {
    return res.status(404).json({ ok: false, message: 'Alert not found' });
  }
  
  alert.isRead = true;
  await alert.save();
  
  res.json({ ok: true, message: 'Alert marked as read' });
}));


router.get('/verify/:touristId', asyncWrap(async (req, res) => {
  const touristId = req.params.touristId;
  

  const verification = touristBlockchain.verifyTouristCard(touristId);
  
  if (!verification.verified) {
    return res.status(404).json({
      ok: false,
      verified: false,
      message: verification.message
    });
  }
  
  // Get from database
  const profile = await TouristProfile.findOne({ touristId }).lean();
  
  res.json({
    ok: true,
    verified: true,
    message: 'Tourist card is authentic and verified on blockchain',
    data: {
      touristId,
      fullName: verification.block.data.fullName,
      country: verification.block.data.country,
      blockchainInfo: {
        blockIndex: verification.blockIndex,
        blockHash: verification.block.hash,
        timestamp: verification.timestamp,
        isChainValid: touristBlockchain.isChainValid()
      },
      profile
    }
  });
}));

// 🔗 BLOCKCHAIN STATS - Get blockchain statistics
router.get('/blockchain/stats', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const stats = touristBlockchain.getStats();
  
  res.json({
    ok: true,
    data: stats
  });
}));

export default router;