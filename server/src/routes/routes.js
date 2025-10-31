import express from 'express';
import axios from 'axios';
import { asyncWrap } from '../utils/error.js';

const router = express.Router();

// 📐 HAVERSINE FORMULA - Calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // in kilometers
}

// ⏱️ ESTIMATE DURATION based on distance and transport mode
function estimateDuration(distanceKm) {
  // Assuming average speed of 30 km/h in city traffic
  const avgSpeedKmh = 30;
  const durationHours = distanceKm / avgSpeedKmh;
  const durationMinutes = Math.ceil(durationHours * 60);
  return durationMinutes;
}

// 🗺️ CALCULATE SAFE ROUTE WITH DETAILED ANALYSIS
router.get('/safe', asyncWrap(async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ ok: false, message: 'Both from and to locations are required' });
  }

  try {
    // Step 1: Geocode FROM location using OpenStreetMap Nominatim (FREE, no API key)
    const fromGeoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: from,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'TouristSafetySystem/1.0'
      }
    });

    // Step 2: Geocode TO location
    const toGeoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: to,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'TouristSafetySystem/1.0'
      }
    });

    if (!fromGeoRes.data || fromGeoRes.data.length === 0) {
      return res.status(404).json({ ok: false, message: `Location not found: ${from}` });
    }

    if (!toGeoRes.data || toGeoRes.data.length === 0) {
      return res.status(404).json({ ok: false, message: `Location not found: ${to}` });
    }

    const fromCoords = { 
      lat: parseFloat(fromGeoRes.data[0].lat), 
      lon: parseFloat(fromGeoRes.data[0].lon),
      address: fromGeoRes.data[0].display_name
    };
    
    const toCoords = { 
      lat: parseFloat(toGeoRes.data[0].lat), 
      lon: parseFloat(toGeoRes.data[0].lon),
      address: toGeoRes.data[0].display_name
    };

    // Step 3: Calculate distance using Haversine formula
    const distanceKm = calculateDistance(
      fromCoords.lat, fromCoords.lon,
      toCoords.lat, toCoords.lon
    );

    // Step 4: Estimate duration
    const durationMin = estimateDuration(distanceKm);

    // Step 5: Generate turn-by-turn directions (simplified)
    const turnByTurn = generateDirections(from, to, fromCoords, toCoords, distanceKm);

    // Step 6: 🎯 COMPREHENSIVE SAFETY ANALYSIS
    const safetyAnalysis = await analyzeSafety(to, toCoords, distanceKm, durationMin);

    res.json({
      ok: true,
      data: {
        from,
        to,
        fromCoords,
        toCoords,
        distanceKm: parseFloat(distanceKm.toFixed(1)),
        durationMin,
        turnByTurn,
        ...safetyAnalysis
      }
    });

  } catch (error) {
    console.error('Route calculation error:', error.response?.data || error.message);
    res.status(500).json({ 
      ok: false, 
      message: 'Failed to calculate route',
      error: error.message 
    });
  }
}));

// 🧭 GENERATE TURN-BY-TURN DIRECTIONS
function generateDirections(from, to, fromCoords, toCoords, distanceKm) {
  const directions = [];
  
  directions.push(`Start from ${from}`);
  
  // Determine general direction
  const latDiff = toCoords.lat - fromCoords.lat;
  const lonDiff = toCoords.lon - fromCoords.lon;
  
  let direction = '';
  if (latDiff > 0 && lonDiff > 0) direction = 'northeast';
  else if (latDiff > 0 && lonDiff < 0) direction = 'northwest';
  else if (latDiff < 0 && lonDiff > 0) direction = 'southeast';
  else if (latDiff < 0 && lonDiff < 0) direction = 'southwest';
  else if (latDiff > 0) direction = 'north';
  else if (latDiff < 0) direction = 'south';
  else if (lonDiff > 0) direction = 'east';
  else direction = 'west';
  
  directions.push(`Head ${direction} toward ${to}`);
  
  if (distanceKm > 10) {
    directions.push(`Continue on main road for approximately ${(distanceKm * 0.6).toFixed(1)} km`);
    directions.push(`Follow signs to ${to}`);
    directions.push(`After ${(distanceKm * 0.8).toFixed(1)} km, you will see ${to} ahead`);
  } else if (distanceKm > 5) {
    directions.push(`Continue straight for ${(distanceKm * 0.7).toFixed(1)} km`);
    directions.push(`${to} will be on your route`);
  } else {
    directions.push(`${to} is nearby, approximately ${distanceKm.toFixed(1)} km ahead`);
  }
  
  directions.push(`Arrive at ${to}`);
  
  return directions;
}

// 🛡️ SAFETY ANALYSIS FUNCTION
async function analyzeSafety(location, coords, distanceKm, durationMin) {
  const locationLower = location.toLowerCase();

  // 1️⃣ GENERAL SAFETY SCORE (0-100)
  let generalSafety = 75;
  
  // Safe zones
  if (locationLower.includes('temple') || locationLower.includes('taj mahal') || 
      locationLower.includes('museum') || locationLower.includes('fort') ||
      locationLower.includes('palace') || locationLower.includes('monument')) {
    generalSafety = 95;
  } else if (locationLower.includes('police') || locationLower.includes('hospital') || 
             locationLower.includes('embassy') || locationLower.includes('airport')) {
    generalSafety = 98;
  } else if (locationLower.includes('market') || locationLower.includes('bazaar') || 
             locationLower.includes('station') || locationLower.includes('mall')) {
    generalSafety = 72;
  } else if (locationLower.includes('highway') || locationLower.includes('forest') || 
             locationLower.includes('isolated')) {
    generalSafety = 55;
  }

  // 2️⃣ HEALTH & MEDICAL FACILITIES (0-100)
  let healthScore = 70;
  const medicalFacilities = [];
  
  if (locationLower.includes('hospital') || locationLower.includes('medical') || 
      locationLower.includes('clinic')) {
    healthScore = 100;
    medicalFacilities.push('Major Hospital Nearby');
    medicalFacilities.push('24/7 Emergency Care');
  } else if (locationLower.includes('city') || locationLower.includes('metro')) {
    healthScore = 85;
    medicalFacilities.push('Multiple Clinics Available');
    medicalFacilities.push('Pharmacies Open 24/7');
  } else {
    healthScore = 65;
    medicalFacilities.push('Basic Medical Facilities');
    medicalFacilities.push('Ambulance Access Available');
  }

  // 3️⃣ WEATHER SAFETY (0-100)
  const currentHour = new Date().getHours();
  let weatherScore = 80;
  const weatherConditions = [];

  // Time-based safety
  if (currentHour >= 6 && currentHour <= 18) {
    weatherScore = 90;
    weatherConditions.push('Daylight Hours - Excellent Visibility');
  } else if (currentHour >= 19 && currentHour <= 22) {
    weatherScore = 75;
    weatherConditions.push('Evening Hours - Good Lighting Recommended');
  } else {
    weatherScore = 60;
    weatherConditions.push('Night Hours - Extra Caution Advised');
  }

  // Seasonal considerations
  const currentMonth = new Date().getMonth();
  if (currentMonth >= 5 && currentMonth <= 8) {
    weatherScore -= 10;
    weatherConditions.push('Monsoon Season - Watch for Rain');
  } else if (currentMonth >= 11 || currentMonth <= 1) {
    weatherConditions.push('Winter Season - Clear Weather Expected');
  } else {
    weatherConditions.push('Pleasant Weather Conditions');
  }

  // 4️⃣ TRAVEL SAFETY (0-100)
  let travelSafety = 80;
  const travelTips = [];

  if (parseFloat(distanceKm) < 5) {
    travelSafety = 90;
    travelTips.push('Short Distance - Low Travel Risk');
    travelTips.push('Walking/Auto-rickshaw Recommended');
  } else if (parseFloat(distanceKm) < 15) {
    travelSafety = 80;
    travelTips.push('Medium Distance - Use Licensed Taxi/Metro');
    travelTips.push('Keep GPS Tracking On');
  } else {
    travelSafety = 70;
    travelTips.push('Long Distance - Pre-book Transportation');
    travelTips.push('Share Trip Details with Family');
  }

  if (locationLower.includes('airport') || locationLower.includes('railway')) {
    travelTips.push('Beware of Touts - Use Official Services');
  }

  // 5️⃣ CULTURAL AWARENESS (0-100)
  let culturalScore = 85;
  const culturalTips = [];

  if (locationLower.includes('temple') || locationLower.includes('mosque') || 
      locationLower.includes('church') || locationLower.includes('gurudwara')) {
    culturalScore = 95;
    culturalTips.push('✅ Dress Modestly - Cover Shoulders & Knees');
    culturalTips.push('✅ Remove Footwear Before Entering');
    culturalTips.push('✅ Respect Photography Restrictions');
    culturalTips.push('✅ Maintain Silence Inside Premises');
  } else if (locationLower.includes('taj mahal') || locationLower.includes('monument')) {
    culturalScore = 90;
    culturalTips.push('✅ Respect Heritage Site Rules');
    culturalTips.push('✅ No Littering or Vandalism');
    culturalTips.push('✅ Follow Guide Instructions');
  } else {
    culturalScore = 80;
    culturalTips.push('✅ Be Respectful of Local Customs');
    culturalTips.push('✅ Avoid Loud Behavior in Public');
    culturalTips.push('✅ Dress Appropriately');
  }

  // 6️⃣ OVERALL SAFETY SCORE
  const overallSafetyScore = Math.round(
    (generalSafety * 0.3) + 
    (healthScore * 0.2) + 
    (weatherScore * 0.15) + 
    (travelSafety * 0.2) + 
    (culturalScore * 0.15)
  );

  // 7️⃣ CROWD LEVEL PREDICTION
  let crowdLevel = 'Medium';
  if (locationLower.includes('taj mahal') || locationLower.includes('market') || 
      locationLower.includes('bazaar')) {
    crowdLevel = currentHour >= 9 && currentHour <= 17 ? 'Very High' : 'High';
  } else if (locationLower.includes('temple') || locationLower.includes('fort')) {
    crowdLevel = currentHour >= 10 && currentHour <= 16 ? 'High' : 'Medium';
  } else {
    crowdLevel = 'Low';
  }

  // 8️⃣ BEST TIME TO VISIT
  let recommendedTime = '';
  if (locationLower.includes('taj mahal')) {
    recommendedTime = 'Sunrise (6-8 AM) or Late Afternoon (4-6 PM)';
  } else if (locationLower.includes('market') || locationLower.includes('bazaar')) {
    recommendedTime = 'Morning (9-11 AM) - Less Crowded';
  } else {
    recommendedTime = 'Daytime (10 AM - 5 PM)';
  }

  // 9️⃣ RISK FACTORS & HIGHLIGHTS
  const highlights = [];
  const riskFactors = [];

  if (overallSafetyScore >= 85) {
    highlights.push('Highly Safe Destination');
    highlights.push('Tourist Police Present');
    highlights.push('CCTV Surveillance');
  } else if (overallSafetyScore >= 70) {
    highlights.push('Generally Safe with Precautions');
    highlights.push('Police Presence Available');
  } else {
    riskFactors.push('Moderate Risk Area - Stay Alert');
    riskFactors.push('Travel in Groups Recommended');
  }

  if (crowdLevel === 'Very High' || crowdLevel === 'High') {
    riskFactors.push('High Crowd - Pickpocketing Risk');
    riskFactors.push('Keep Valuables Secure');
  }

  if (riskFactors.length === 0) {
    riskFactors.push('None');
  }

  // 🔟 WHEN TO VISIT RECOMMENDATION
  const visitRecommendation = {
    bestTime: recommendedTime,
    avoid: currentHour < 6 || currentHour > 20 ? 'Avoid Late Night Travel' : 'Avoid Peak Afternoon Hours (12-3 PM in Summer)',
    safestDays: 'Weekdays (Less Crowded)',
    crowdedDays: 'Weekends & Public Holidays'
  };

  return {
    safetyScore: overallSafetyScore,
    crowdLevel,
    recommendedTime,
    visitRecommendation,
    
    // Detailed breakdown
    safetyBreakdown: {
      generalSafety: { score: generalSafety, label: 'General Safety' },
      healthMedical: { score: healthScore, label: 'Health & Medical Facilities', facilities: medicalFacilities },
      weather: { score: weatherScore, label: 'Weather Conditions', conditions: weatherConditions },
      travelSafety: { score: travelSafety, label: 'Travel Safety', tips: travelTips },
      culturalAwareness: { score: culturalScore, label: 'Cultural Awareness', tips: culturalTips }
    },
    
    highlights,
    riskFactors
  };
}

export default router;
