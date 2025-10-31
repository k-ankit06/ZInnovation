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
  let profile = await TouristProfile.findOne({ userId: user._id });
  if (!profile) profile = new TouristProfile({ userId: user._id });

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
    group: Array.isArray(body.group) ? body.group : profile.group || []
  });

  if (!profile.touristId) profile.touristId = genTouristId();

  const { canonical, idHash } = canonicalizeTourist({
    fullName: profile.fullName,
    email: user.email,
    phone: profile.phone,
    touristType: profile.touristType,
    country: profile.country,
    passportNumber: profile.passportNumber,
    aadhaarNumber: profile.aadhaarNumber,
    dateOfBirth: profile.dateOfBirth
  }, profile?.canonicalPayload?.nonce);

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

router.get('/me', requireAuth, requireRole('tourist'), asyncWrap(async (req, res) => {
  const prof = await TouristProfile.findOne({ userId: req.user.id }).lean();
  if (!prof) return res.json({ ok: true, data: { isRegistered: false } });
  res.json({ ok: true, data: { ...prof, id: prof._id } });
}));

export default router;