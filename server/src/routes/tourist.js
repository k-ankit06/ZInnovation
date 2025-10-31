import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import TouristProfile from '../models/Touristprofile.js';
import User from '../models/User.js';
import { canonicalizeTourist } from '../utils/hash.js';
import { asyncWrap } from '../utils/error.js';
import { v4 as uuid } from 'uuid';
import { sendTouristProfileCompletedEmail } from '../services/emailService.js';

const router = express.Router();

function genTouristId() {
  return `TID-${Date.now().toString().slice(-6)}-${uuid().slice(0, 4).toUpperCase()}`;
}

router.post('/register', requireAuth, requireRole('tourist'), asyncWrap(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ ok: false, message: 'User not found' });

  const body = req.body || {};
  
  // Create a NEW profile each time (multi-card support)
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

  await sendTouristProfileCompletedEmail({ user, profile });

  return res.json({
    ok: true,
    data: {
      touristId: profile.touristId,
      idHash: profile.idHash,
      isRegistered: profile.isRegistered
    }
  });
}));

// Get all cards for logged-in tourist
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

// Delete a specific card for the tourist
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

// Get all tourist cards (for authority)
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

// Delete tourist card (for authority)
router.delete('/cards/:id', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const touristId = req.params.id;
  const result = await TouristProfile.findOneAndDelete({ touristId });
  
  if (!result) {
    return res.status(404).json({ ok: false, message: 'Tourist not found' });
  }
  
  res.json({ ok: true, message: 'Tourist card removed successfully' });
}));

export default router;