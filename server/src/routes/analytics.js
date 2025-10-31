import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import Incident from '../models/Incident.js';
import TouristProfile from '../models/Touristprofile.js';

const router = express.Router();

router.get('/summary', requireAuth, requireRole('authority'), async (req, res) => {
  const activeIncidents = await Incident.countDocuments({ status: { $in: ['open','assigned'] } });
  const activeTourists = await TouristProfile.countDocuments({ isRegistered: true });
  const safetyScore = 0.94;
  const avgResponseTime = 2.3;
  res.json({ ok: true, data: { activeTourists, activeIncidents, safetyScore, avgResponseTime } });
});

router.get('/timeseries', requireAuth, requireRole('authority'), async (req, res) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun'];
  const data = months.map((m, i) => ({
    month: m, tourists: 2000 + i*250, incidents: 40 - i*3, resolved: 38 - i*3, revenue: 10000 + i*1500
  }));
  res.json({ ok: true, data });
});

router.get('/incidents-by-type', requireAuth, requireRole('authority'), async (req, res) => {
  const data = [
    { name: 'Medical', value: 35 },
    { name: 'Theft', value: 25 },
    { name: 'Lost Tourist', value: 20 },
    { name: 'Language', value: 12 },
    { name: 'Others', value: 8 }
  ];
  res.json({ ok: true, data });
});

router.get('/locations', requireAuth, requireRole('authority'), async (req, res) => {
  const data = [
    { location: 'Taj Mahal', tourists: 4500, incidents: 12 },
    { location: 'India Gate', tourists: 3800, incidents: 18 },
    { location: 'Red Fort', tourists: 3200, incidents: 22 },
    { location: 'Qutub Minar', tourists: 2500, incidents: 8 },
    { location: 'Gateway of India', tourists: 4200, incidents: 15 }
  ];
  res.json({ ok: true, data });
});

export default router;