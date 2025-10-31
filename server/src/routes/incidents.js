import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import Incident from '../models/Incident.js';
import { asyncWrap } from '../utils/error.js';

const router = express.Router();

// List
router.get('/', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const { status, type, severity, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (severity) filter.severity = severity;
  if (q) filter.$or = [{ refId: new RegExp(q, 'i') }, { notes: new RegExp(q, 'i') }];

  const docs = await Incident.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean();
  const count = await Incident.countDocuments(filter);
  res.json({ ok: true, data: docs, pagination: { page: Number(page), limit: Number(limit), total: count } });
}));

// Create
router.post('/', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const body = req.body || {};
  const refId = `INC-${Date.now().toString().slice(-6)}`;
  const created = await Incident.create({ ...body, refId });
  console.log('[INCIDENT CREATED]', created._id.toString(), 'refId:', created.refId);
  res.status(201).json({ ok: true, data: created });
}));

// Update
router.patch('/:id', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  const updated = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ ok: true, data: updated });
}));

// Delete
router.delete('/:id', requireAuth, requireRole('authority'), asyncWrap(async (req, res) => {
  await Incident.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

export default router;