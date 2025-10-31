import express from 'express';
import TouristProfile from '../models/Touristprofile.js';
import { asyncWrap } from '../utils/error.js';

const router = express.Router();

router.get('/:touristId', asyncWrap(async (req, res) => {
  const { touristId } = req.params;
  const prof = await TouristProfile.findOne({ touristId }).lean();
  if (!prof) return res.json({ ok: true, data: { exists: false} });

  const n = (prof.fullName || 'Tourist').split(' ');
  const mask = (s) => s ? s[0] + '*'.repeat(Math.max(1, s.length-1)) : '';
  const maskedName = [mask(n[0]), n[1] ? mask(n[1]) : ''].filter(Boolean).join(' ');

  res.json({
    ok: true,
    data: {
      exists: true,
      name: maskedName,
      country: prof.country,
      touristId: prof.touristId,
      idHash: prof.idHash,
      createdAt: prof.createdAt
    }
  });
}));

export default router;