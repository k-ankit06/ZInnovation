import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import TouristProfile from '../models/Touristprofile.js';
import { asyncWrap } from '../utils/error.js';
import { canonicalizeTourist } from '../utils/hash.js';
import { sendTouristProfileUpdatedEmail } from '../services/emailService.js';

const router = express.Router();

router.get('/me', requireAuth, asyncWrap(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ ok: false, message: 'User not found' });
  res.json({ ok: true, data: user.toPublic() });
}));

router.patch('/me', requireAuth, asyncWrap(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ ok: false, message: 'User not found' });

  const { name, phone, designation, emergencyContactName, emergencyContactPhone } = req.body || {};
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (user.role === 'authority' && designation !== undefined) user.designation = designation;
  await user.save();

  if (user.role === 'tourist') {
    const prof = await TouristProfile.findOne({ userId: user._id });
    if (prof) {
      if (emergencyContactName !== undefined) prof.emergencyContactName = emergencyContactName;
      if (emergencyContactPhone !== undefined) prof.emergencyContactPhone = emergencyContactPhone;

      if (name || phone) {
        const { canonical, idHash } = canonicalizeTourist(
          { ...prof.toObject(), fullName: user.name, phone: user.phone },
          prof?.canonicalPayload?.nonce
        );
        prof.canonicalPayload = canonical;
        prof.idHash = idHash;
        prof.cardVersion = (prof.cardVersion || 1) + 1;
      }
      await prof.save();
    }
    await sendTouristProfileUpdatedEmail({ user: user.toPublic() });
  }

  res.json({ ok: true, data: user.toPublic() });
}));

export default router;