import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncWrap } from '../utils/error.js';
import { geocode as orsGeocode, route as orsRoute } from '../services/orsService.js';
import axios from 'axios';

const router = express.Router();

// Fallback geocode (Nominatim) - no key
async function geocodeNominatim(place) {
  const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: { q: place, format: 'json', limit: 1 },
    headers: {
      'User-Agent': 'tourist-safety-app/1.0 (contact: demo@example.com)'
    }
  });
  if (!Array.isArray(data) || data.length === 0) return null;
  return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
}

// Fallback route (OSRM) - no key
async function routeOSRM(fromCoord, toCoord) {
  const url = `https://router.project-osrm.org/route/v1/driving/${fromCoord[0]},${fromCoord[1]};${toCoord[0]},${toCoord[1]}?overview=false&steps=true`;
  const { data } = await axios.get(url);
  if (data.code !== 'Ok' || !data.routes?.[0]) {
    const msg = data?.message || 'OSRM routing failed';
    const e = new Error(msg);
    e.status = 502;
    throw e;
  }
  const route = data.routes[0];
  const distanceKm = (route.distance / 1000).toFixed(2);
  const durationMin = Math.round(route.duration / 60);
  const steps = route.legs?.[0]?.steps || [];
  const turnByTurn = steps.map((s) => {
    const m = s.maneuver || {};
    const name = s.name ? ` on ${s.name}` : '';
    return `${m.instruction || m.type || 'Proceed'}${name}`;
  });
  return { distanceKm, durationMin, turnByTurn };
}

router.get('/safe', requireAuth, asyncWrap(async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.status(400).json({ ok: false, message: 'from and to required' });

  const hasOrs = !!process.env.ORS_API_KEY;

  // Geocode
  let fromCoord = null, toCoord = null, geocodeProvider = 'ORS';
  try {
    if (hasOrs) {
      fromCoord = await orsGeocode(from);
      toCoord = await orsGeocode(to);
    }
    if (!hasOrs || !fromCoord || !toCoord) {
      geocodeProvider = 'Nominatim';
      fromCoord = fromCoord || await geocodeNominatim(from);
      toCoord = toCoord || await geocodeNominatim(to);
    }
  } catch (err) {
    console.error('Geocode error:', err?.message || err);
    return res.status(502).json({ ok: false, message: `Failed to geocode (${geocodeProvider})` });
  }

  if (!fromCoord || !toCoord) {
    return res.status(400).json({ ok: false, message: 'Could not geocode one or both locations' });
  }

  // Route
  let distanceKm, durationMin, turnByTurn;
  let routeProvider = 'ORS';
  try {
    if (hasOrs) {
      const data = await orsRoute(fromCoord, toCoord);
      const summary = data?.features?.[0]?.properties?.summary;
      const steps = data?.features?.[0]?.properties?.segments?.[0]?.steps || [];
      if (!summary) throw new Error('ORS returned no summary');
      distanceKm = (summary.distance / 1000).toFixed(2);
      durationMin = Math.round(summary.duration / 60);
      turnByTurn = steps.map((s) => s.instruction);
    } else {
      throw new Error('ORS key not configured');
    }
  } catch (err) {
    console.warn('ORS routing failed, falling back to OSRM:', err?.message || err);
    routeProvider = 'OSRM';
    try {
      const r = await routeOSRM(fromCoord, toCoord);
      distanceKm = r.distanceKm;
      durationMin = r.durationMin;
      turnByTurn = r.turnByTurn;
    } catch (e2) {
      console.error('OSRM routing failed:', e2?.message || e2);
      return res.status(e2?.status || 502).json({ ok: false, message: 'Failed to fetch route from providers' });
    }
  }

  const payload = {
    distanceKm,
    durationMin,
    safetyScore: Math.floor(Math.random() * 20) + 80,
    crowdLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    highlights: ['Well connected roads', 'Police stations nearby'],
    riskFactors: ['None'],
    turnByTurn,
    meta: { geocodeProvider, routeProvider }
  };

  res.json({ ok: true, data: payload });
}));

export default router;