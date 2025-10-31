import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncWrap } from '../utils/error.js';
import { sendRegistrationEmail } from '../services/emailService.js';

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Optional: check-email endpoint for debugging
router.get('/check-email', asyncWrap(async (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ ok: false, message: 'email required' });
  const exists = await User.exists({ email });
  res.json({ ok: true, data: { exists: !!exists } });
}));

// Register (no placeholder TouristProfile here; we send prefill to client)
router.post('/register', asyncWrap(async (req, res) => {
  const {
    name, email, phone, password, role,
    touristType, country, passportNumber, aadhaarNumber,
    designation, emergencyContactName, emergencyContact // from signup form
  } = req.body || {};

  if (!name || !email || !password || !role) {
    return res.status(400).json({ ok: false, message: 'Missing required fields' });
  }
  if (!['tourist','authority'].includes(role)) {
    return res.status(400).json({ ok: false, message: 'Invalid role' });
  }

  const normEmail = String(email).trim().toLowerCase();

  const exists = await User.findOne({ email: normEmail });
  if (exists) return res.status(409).json({ ok: false, message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await User.create({
      name: String(name).trim(),
      email: normEmail,
      passwordHash,
      role,
      phone,
      designation: role === 'authority' ? designation : undefined
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, message: 'Email already registered' });
    }
    throw err;
  }

  let isRegistered = false;
  let prefill;
  if (role === 'tourist') {
    // Best-effort admin email
    await sendRegistrationEmail({
      name: String(name).trim(),
      email: normEmail,
      role,
      touristType: touristType || 'international',
      country: country || ''
    });

    // Send back prefill object to auto-fill registration form
    prefill = {
      fullName: String(name).trim(),
      email: normEmail,
      phone: phone || '',
      country: country || '',
      touristType: touristType || 'international',
      passportNumber: passportNumber || '',
      aadhaarNumber: aadhaarNumber || '',
      emergencyContactName: emergencyContactName || '',
      emergencyContactPhone: emergencyContact || ''
    };
  }

  const token = signToken(user);
  const pub = user.toPublic();
  return res.status(201).json({ ...pub, token, isRegistered, prefill });
}));

// Login
router.post('/login', asyncWrap(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, message: 'Missing credentials' });

  const user = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (!user) return res.status(401).json({ ok: false, message: 'Invalid email or password' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ ok: false, message: 'Invalid email or password' });

  const token = signToken(user);
  const pub = user.toPublic();
  res.json({ ...pub, token, isRegistered: false });
}));

// Me
router.get('/me', asyncWrap(async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, message: 'Missing token' });

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.id);
  if (!user) return res.status(401).json({ ok: false, message: 'User not found' });

  res.json({ ...user.toPublic(), token, isRegistered: false });
}));

export default router;