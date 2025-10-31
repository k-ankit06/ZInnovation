import axios from 'axios';

const ORS_KEY = process.env.ORS_API_KEY;
const ORS_BASE = 'https://api.openrouteservice.org';

function formatOrsError(stage, err) {
  if (err?.response) {
    const { status, data } = err.response;
    const msg = data?.error?.message || data?.message || JSON.stringify(data);
    const e = new Error(`ORS ${stage} failed [${status}]: ${msg}`);
    e.status = status;
    e.detail = data;
    return e;
  } else if (err?.request) {
    const e = new Error(`ORS ${stage} no response from provider`);
    e.status = 502;
    return e;
  } else {
    const e = new Error(`ORS ${stage} error: ${err?.message || 'unknown'}`);
    e.status = 500;
    return e;
  }
}

export async function geocode(place) {
  if (!ORS_KEY) throw new Error('ORS_API_KEY not set');
  try {
    const { data } = await axios.get(`${ORS_BASE}/geocode/search`, {
      params: { api_key: ORS_KEY, text: place }
    });
    const features = data?.features || [];
    if (!features.length) return null;
    return features[0]?.geometry?.coordinates; // [lng, lat]
  } catch (err) {
    throw formatOrsError('geocode', err);
  }
}

export async function route(fromCoords, toCoords) {
  if (!ORS_KEY) throw new Error('ORS_API_KEY not set');
  try {
    const { data } = await axios.post(
      `${ORS_BASE}/v2/directions/driving-car/geojson`,
      { coordinates: [fromCoords, toCoords] },
      { headers: { Authorization: ORS_KEY, 'Content-Type': 'application/json' } }
    );
    return data;
  } catch (err) {
    throw formatOrsError('directions', err);
  }
}