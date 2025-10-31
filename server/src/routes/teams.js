import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import Team from '../models/Team.js';
import { asyncWrap } from '../utils/error.js';

const router = express.Router();

async function ensureSeed() {
  const count = await Team.countDocuments();
  if (count === 0) {
    await Team.insertMany([
      { name: 'Medical Team Alpha', type: 'Medical', members: 4, status: 'Available', location: 'Taj Mahal Station', contact: '+91 98765 43210', avgResponseMins: 3, completedToday: 8 },
      { name: 'Police Unit Bravo', type: 'Police', members: 6, status: 'On Duty', location: 'Red Fort Area', contact: '+91 98765 43211', avgResponseMins: 4, completedToday: 12 }
    ]);
  }
}
ensureSeed();

router.get('/', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const teams = await Team.find().sort({ createdAt: -1 });
  res.json({ ok: true, data: teams });
}));

router.patch('/:id/assign', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const { incidentId } = req.body || {};
  const updated = await Team.findByIdAndUpdate(req.params.id, { status: 'On Duty', currentAssignment: incidentId }, { new: true });
  res.json({ ok: true, data: updated });
}));

router.patch('/:id/complete', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const t = await Team.findById(req.params.id);
  if (!t) return res.status(404).json({ ok: false, message: 'Team not found' });
  t.status = 'Available';
  t.currentAssignment = null;
  t.completedToday = (t.completedToday || 0) + 1;
  await t.save();
  res.json({ ok: true, data: t });
}));

export default router;