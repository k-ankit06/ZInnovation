import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Incident from '../models/Incident.js';
import { asyncWrap } from '../utils/error.js';

const router = express.Router();

router.post('/sos', requireAuth, asyncWrap(async (req, res) => {
  const { latitude, longitude, notes } = req.body || {};
  if (latitude == null || longitude == null) {
    return res.status(400).json({ ok: false, message: 'lat/lng required' });
  }
  const refId = `INC-${Date.now().toString().slice(-6)}`;
  const eta = 3 + Math.floor(Math.random() * 5);

  const incident = await Incident.create({
    refId, reporterId: req.user.id, type: 'SOS', severity: 'High',
    status: 'open', location: { lat: latitude, lng: longitude },
    etaMinutes: eta,
    notes,
    timeline: [{ t: new Date(), event: 'SOS created' }, { t: new Date(), event: `ETA ${eta} mins` }]
  });

  res.json({ ok: true, data: { incidentId: incident._id, refId, etaMinutes: eta } });
}));

router.post('/alert', requireAuth, asyncWrap(async (req, res) => {
  const { latitude, longitude, service } = req.body || {};
  if (latitude == null || longitude == null || !service) {
    return res.status(400).json({ ok: false, message: 'lat/lng/service required' });
  }
  const refId = `INC-${Date.now().toString().slice(-6)}`;
  const eta = 2 + Math.floor(Math.random() * 6);

  await Incident.create({
    refId, reporterId: req.user.id, type: service.includes('Medical') ? 'Medical' : 'Police',
    severity: 'Medium', status: 'open', location: { lat: latitude, lng: longitude },
    etaMinutes: eta, timeline: [{ t: new Date(), event: `Alert: ${service}` }]
  });

  res.json({ ok: true, data: { eta: eta } });
}));

export default router;