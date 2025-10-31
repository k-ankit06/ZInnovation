import { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, Shield, Clock, TrendingUp, CheckCircle, Loader, Heart, Cloud, Users, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/apiClient';
import { toast } from 'react-toastify';

const SafeRoutes = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchedRoute, setSearchedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const popularRoutes = [
    {
      id: 1, from: 'Hotel Oberoi Amarvilas', to: 'Taj Mahal', distance: '1.2 km', duration: '5 mins', safetyScore: 98, crowdLevel: 'Medium',
      route: 'Via Taj East Gate Road', transportMode: 'Walking/Auto',
      highlights: ['Well-lit path', 'Tourist police present', 'CCTV coverage'],
      riskFactors: ['None'],
      nearbyHelpPoints: [
        { name: 'Tourist Police Booth (Taj)', distance: '150m', type: 'Police' },
        { name: 'First Aid Center', distance: '200m', type: 'Medical' },
        { name: 'Safe Zone Shelter', distance: '400m', type: 'Shelter' },
        { name: 'Tourist Help Desk', distance: '100m', type: 'Information' },
      ],
      liveUpdates: [
        { area: 'Taj Mahal Area', status: 'SAFE', message: 'Low crowd. Excellent visibility. Police active.' }
      ],
      turnByTurn: [
        'Start from Hotel Oberoi Amarvilas',
        'Head east on Taj East Gate Road (200m)',
        'Turn right toward Taj Mahal entrance (150m)',
        'Pass through security checkpoint',
        'Arrive at Taj Mahal East Gate'
      ]
    },
    {
      id: 2, from: 'India Gate', to: 'Red Fort', distance: '5.8 km', duration: '25 mins', safetyScore: 88, crowdLevel: 'High',
      route: 'Via Rajpath & Netaji Subhash Marg', transportMode: 'Metro/Taxi',
      highlights: ['Metro available', 'Tourist police', 'Safe parking'],
      riskFactors: ['Pickpocketing risk', 'Heavy crowd'],
      nearbyHelpPoints: [
        { name: 'Chandni Chowk Police Station', distance: '500m', type: 'Police' },
        { name: 'LNJP Hospital', distance: '1.2 km', type: 'Medical' },
        { name: 'Delhi Tourist Center', distance: '800m', type: 'Information' },
      ],
      liveUpdates: [
        { area: 'Chandni Chowk Market', status: 'CAUTION', message: 'High crowd density reported. Beware of belongings.' }
      ],
      turnByTurn: [
          'Start from India Gate Circle',
          'Take C-Hexagon to Tilak Marg (1.5 km)',
          'Continue on Netaji Subhash Marg (4 km)',
          'You will see Red Fort on your right'
      ]
    }
  ];

  const safetyFeatures = [
    { icon: Shield, title: 'Real-time Safety Monitoring', description: 'AI-powered risk assessment updates every 5 minutes' },
    { icon: AlertTriangle, title: 'Live Alerts', description: 'Instant notifications about incidents or unsafe conditions' },
    { icon: MapPin, title: 'GPS Tracking', description: 'Your location is tracked for emergency assistance' },
    { icon: Clock, title: 'Best Time Suggestions', description: 'Recommended travel times based on safety data' }
  ];

  const handleSearchRoute = async () => {
    if (!fromLocation || !toLocation) {
      toast.error("Please enter both From and To locations.");
      return;
    }

    setIsLoading(true);
    setSearchedRoute(null);
    setSelectedRoute(null);

    try {
      // Call new comprehensive API
      const { data } = await api.get('/api/routes/safe', {
        params: { from: fromLocation, to: toLocation }
      });

      const payload = data?.data || data;
      const distanceKm = payload.distanceKm;
      const durationMin = payload.durationMin;
      const breakdown = payload.safetyBreakdown || {};

      const newRoute = {
        id: Date.now(),
        from: fromLocation,
        to: toLocation,
        distance: `${distanceKm} km`,
        duration: `${durationMin} mins`,
        safetyScore: payload.safetyScore,
        crowdLevel: payload.crowdLevel,
        recommendedTime: payload.recommendedTime,
        route: "Recommended Safe Route",
        transportMode: distanceKm < 5 ? 'Walking/Auto' : distanceKm < 15 ? 'Taxi/Metro' : 'Pre-booked Car',
        highlights: payload.highlights || ["Safe route calculated"],
        riskFactors: payload.riskFactors || ["None"],
        
        // 🎯 COMPREHENSIVE SAFETY BREAKDOWN
        safetyBreakdown: {
          generalSafety: breakdown.generalSafety || { score: 75, label: 'General Safety' },
          healthMedical: breakdown.healthMedical || { score: 70, label: 'Health & Medical', facilities: [] },
          weather: breakdown.weather || { score: 80, label: 'Weather Conditions', conditions: [] },
          travelSafety: breakdown.travelSafety || { score: 80, label: 'Travel Safety', tips: [] },
          culturalAwareness: breakdown.culturalAwareness || { score: 85, label: 'Cultural Awareness', tips: [] }
        },
        
        visitRecommendation: payload.visitRecommendation || {
          bestTime: 'Daytime (10 AM - 5 PM)',
          avoid: 'Late night hours',
          safestDays: 'Weekdays',
          crowdedDays: 'Weekends'
        },
        
        nearbyHelpPoints: [
          { name: 'Nearest Police Station', distance: '0.8 km', type: 'Police' },
          { name: 'City Hospital', distance: '1.5 km', type: 'Medical' },
          { name: 'Tourist Help Desk', distance: '0.5 km', type: 'Information' },
          { name: 'Safe Rest Stop', distance: '1.2 km', type: 'Shelter' }
        ],
        
        liveUpdates: [
          {
            area: toLocation,
            status: payload.safetyScore >= 80 ? 'SAFE' : 'CAUTION',
            message: payload.safetyScore >= 80 
              ? 'Area is safe for tourists. No recent incidents reported.' 
              : 'Moderate risk area. Stay alert and follow safety guidelines.'
          },
        ],
        
        turnByTurn: payload.turnByTurn || [
          `Start from ${fromLocation}`,
          `Follow recommended route to ${toLocation}`,
          `Arrive at destination`
        ],
      };

      setSearchedRoute(newRoute);
      
      // Show success with safety score
      if (payload.safetyScore >= 80) {
        toast.success(`✅ Safe Route Found! Safety Score: ${payload.safetyScore}%`);
      } else if (payload.safetyScore >= 60) {
        toast.warning(`⚠️ Moderate Safety Route. Score: ${payload.safetyScore}%`);
      } else {
        toast.error(`🚨 High Risk Route! Score: ${payload.safetyScore}%. Consider alternatives.`);
      }
      
    } catch (error) {
      console.error("Error fetching route:", error);
      toast.error(error?.response?.data?.message || "Failed to calculate route. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSafetyColor = (score) => {
    if (score >= 90) return 'text-success-600 bg-success-100'
    if (score >= 75) return 'text-warning-600 bg-warning-100'
    return 'text-danger-600 bg-danger-100'
  };

  const getCrowdColor = (level) => {
    switch(level) {
      case 'Low': return 'bg-success-100 text-success-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'High': return 'bg-orange-100 text-orange-700'
      case 'Very High': return 'bg-danger-100 text-danger-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  };

  const activeRouteData = searchedRoute || selectedRoute || popularRoutes[0];

  const renderRouteCard = (route, isSearched = false) => (
    <div key={route.id} className={`border-2 rounded-lg p-5 hover:shadow-lg transition-all ${isSearched ? 'border-primary-500 border-4 bg-primary-50' : selectedRoute?.id === route.id ? 'border-primary-500' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-success-600" /><span className="font-semibold text-gray-900">{route.from}</span></div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-danger-600" /><span className="font-semibold text-gray-900">{route.to}</span></div>
          </div>
          <p className="text-sm text-gray-600 mb-1">{route.route}</p>
          <p className="text-xs text-gray-500">Recommended: {route.transportMode || '—'}</p>
        </div>
        <div className="text-right">
          <div className={`px-4 py-2 rounded-full font-bold text-lg mb-1 ${getSafetyColor(route.safetyScore)}`}>{route.safetyScore}%</div>
          <p className="text-xs text-gray-500">Overall Safety</p>
        </div>
      </div>
      
      {/* Distance & Duration Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3">
        <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-600 mb-1">Distance</p><p className="font-bold text-gray-900">{route.distance}</p></div>
        <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-600 mb-1">Duration</p><p className="font-bold text-gray-900">{route.duration}</p></div>
        <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-600 mb-1">Crowd Level</p><span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCrowdColor(route.crowdLevel)}`}>{route.crowdLevel}</span></div>
        <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-600 mb-1">Best Time</p><p className="font-bold text-gray-900 text-xs">{route.recommendedTime || '—'}</p></div>
      </div>
      
      {/* 🎯 COMPREHENSIVE SAFETY ANALYSIS - Only for searched routes */}
      {isSearched && route.safetyBreakdown && (
        <div className="mb-4">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary-600" />
            Detailed Safety Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* General Safety */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">General Safety</span>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold ${getSafetyColor(route.safetyBreakdown.generalSafety.score)}`}>
                  {route.safetyBreakdown.generalSafety.score}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${route.safetyBreakdown.generalSafety.score}%` }}></div>
              </div>
            </div>
            
            {/* Health & Medical */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-900">Health & Medical</span>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold ${getSafetyColor(route.safetyBreakdown.healthMedical.score)}`}>
                  {route.safetyBreakdown.healthMedical.score}%
                </span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: `${route.safetyBreakdown.healthMedical.score}%` }}></div>
              </div>
              {route.safetyBreakdown.healthMedical.facilities?.length > 0 && (
                <div className="text-xs text-red-800 mt-2">
                  {route.safetyBreakdown.healthMedical.facilities.map((f, i) => (
                    <p key={i}>• {f}</p>
                  ))}
                </div>
              )}
            </div>
            
            {/* Weather Conditions */}
            <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-cyan-600" />
                  <span className="font-semibold text-cyan-900">Weather Safety</span>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold ${getSafetyColor(route.safetyBreakdown.weather.score)}`}>
                  {route.safetyBreakdown.weather.score}%
                </span>
              </div>
              <div className="w-full bg-cyan-200 rounded-full h-2 mb-2">
                <div className="bg-cyan-600 h-2 rounded-full" style={{ width: `${route.safetyBreakdown.weather.score}%` }}></div>
              </div>
              {route.safetyBreakdown.weather.conditions?.length > 0 && (
                <div className="text-xs text-cyan-800 mt-2">
                  {route.safetyBreakdown.weather.conditions.map((c, i) => (
                    <p key={i}>• {c}</p>
                  ))}
                </div>
              )}
            </div>
            
            {/* Travel Safety */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Travel Safety</span>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold ${getSafetyColor(route.safetyBreakdown.travelSafety.score)}`}>
                  {route.safetyBreakdown.travelSafety.score}%
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${route.safetyBreakdown.travelSafety.score}%` }}></div>
              </div>
              {route.safetyBreakdown.travelSafety.tips?.length > 0 && (
                <div className="text-xs text-green-800 mt-2">
                  {route.safetyBreakdown.travelSafety.tips.map((t, i) => (
                    <p key={i}>• {t}</p>
                  ))}
                </div>
              )}
            </div>
            
            {/* Cultural Awareness */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">Cultural Awareness</span>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold ${getSafetyColor(route.safetyBreakdown.culturalAwareness.score)}`}>
                  {route.safetyBreakdown.culturalAwareness.score}%
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${route.safetyBreakdown.culturalAwareness.score}%` }}></div>
              </div>
              {route.safetyBreakdown.culturalAwareness.tips?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-purple-800">
                  {route.safetyBreakdown.culturalAwareness.tips.map((t, i) => (
                    <p key={i} className="bg-white/50 px-2 py-1 rounded">{t}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* When to Visit Recommendations */}
      {isSearched && route.visitRecommendation && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 p-4 rounded-lg mb-3">
          <h4 className="font-bold text-amber-900 mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            When to Visit - Best Time Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">✅ Best Time</p>
              <p className="font-bold text-green-700">{route.visitRecommendation.bestTime}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">⚠️ Avoid</p>
              <p className="font-bold text-orange-700">{route.visitRecommendation.avoid}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">📅 Safest Days</p>
              <p className="font-bold text-blue-700">{route.visitRecommendation.safestDays}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">👥 Crowded Days</p>
              <p className="font-bold text-red-700">{route.visitRecommendation.crowdedDays}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-primary-50 p-3 rounded-lg mb-3">
        <p className="text-sm font-semibold text-primary-900 mb-2">✨ Route Highlights:</p>
        <div className="flex flex-wrap gap-2">{route.highlights.map((h, idx) => (<span key={idx} className="px-2 py-1 bg-white text-primary-700 rounded text-xs font-medium">✓ {h}</span>))}</div>
      </div>
      {route.riskFactors[0] !== 'None' && (<div className="bg-warning-50 border-l-4 border-warning-500 p-3 rounded mb-3"><p className="text-sm font-semibold text-warning-900 mb-1">⚠️ Risk Factors:</p><p className="text-sm text-warning-800">{route.riskFactors.join(', ')}</p></div>)}
      <div className="flex gap-3">
        <button onClick={() => setSelectedRoute(route)} className="flex-1 btn-primary"><Navigation className="inline h-4 w-4 mr-2" />Details & Navigate</button>
        <button className="flex-1 bg-success-600 text-white px-4 py-2 rounded-lg font-semibold"><MapPin className="inline h-4 w-4 mr-2" />View on Map</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-bold text-gray-900">Safe Routes Navigator</h2><p className="text-gray-600 mt-1">AI-powered safe route recommendations with real-time risk assessment</p></div>
      
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center"><Navigation className="h-6 w-6 mr-2" />Plan Your Safe Route</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm text-primary-100 mb-2">From</label><input type="text" placeholder="Enter starting point..." className="w-full px-4 py-3 rounded-lg text-gray-900" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} /></div>
          <div><label className="block text-sm text-primary-100 mb-2">To</label><input type="text" placeholder="Enter destination..." className="w-full px-4 py-3 rounded-lg text-gray-900" value={toLocation} onChange={(e) => setToLocation(e.target.value)} /></div>
        </div>
        <button onClick={handleSearchRoute} disabled={isLoading} className="w-full bg:white text-primary-600 py-3 rounded-lg hover:bg-primary-50 font-semibold flex items-center justify-center disabled:opacity-50 bg-white">
          {isLoading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : '🗺️'}
          {isLoading ? 'Finding Safest Route...' : 'Find Safest Route'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {safetyFeatures.map((feature, index) => { const Icon = feature.icon; return (<div key={index} className="card text-center hover:shadow-lg transition-shadow"><div className="inline-block p-3 bg-primary-100 rounded-full mb-3"><Icon className="h-8 w-8 text-primary-600" /></div><h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4><p className="text-sm text-gray-600">{feature.description}</p></div>)})}
      </div>

      <AnimatePresence>
        {searchedRoute && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card">
            <h3 className="text-xl font-bold mb-4">✨ Your Recommended Safest Route</h3>
            {renderRouteCard(searchedRoute, true)}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card">
        <h3 className="text-xl font-bold mb-4">🌟 Popular Safe Routes</h3>
        <div className="space-y-4">{popularRoutes.map((route) => renderRouteCard(route))}</div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center"><Shield className="h-6 w-6 mr-2 text-primary-600" />Nearby Help Points on: <span className="text-primary-600 ml-2">{activeRouteData.to}</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeRouteData.nearbyHelpPoints.map((point, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  point.type === 'Police' ? 'bg-primary-100 text-primary-700' :
                  point.type === 'Medical' ? 'bg-danger-100 text-danger-700' :
                  'bg-success-100 text-success-700'
                }`}>{point.type}</span>
                <span className="text-sm font-bold text-gray-600">{point.distance}</span>
              </div>
              <p className="font-semibold text-gray-900">{point.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card bg-success-50 border-2 border-success-300">
        <h3 className="text-xl font-bold text-success-900 mb-4">🛡️ Route Safety Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{['Share your route and ETA with family/friends','Keep your phone charged and GPS enabled','Follow the recommended route for maximum safety','Avoid shortcuts through unfamiliar areas','Travel during recommended time windows','Stay alert and aware of your surroundings','Keep emergency contacts readily accessible','Use authorized transportation services only'].map((tip, index) => (<div key={index} className="flex items-start gap-2 bg-white p-3 rounded-lg"><CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" /><span className="text-gray-700">{tip}</span></div>))}</div>
      </div>

      <div className="card bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center"><TrendingUp className="h-6 w-6 mr-2" />Live Safety Updates for: <span className="text-purple-200 ml-2">{activeRouteData.to}</span></h3>
        <div className="space-y-3">
          {activeRouteData.liveUpdates.map((update, index) => (<div key={index} className="bg-white/20 backdrop-blur rounded-lg p-3"><div className="flex items-center justify-between mb-1"><span className="font-semibold">{update.area}</span><span className={`px-2 py-1 rounded-full text-xs font-bold ${update.status === 'SAFE' ? 'bg-success-500' : 'bg-warning-500'}`}>{update.status}</span></div><p className="text-sm text-purple-100">{update.message}</p></div>))}
        </div>
      </div>

      {selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"><div className="p-6"><div className="flex items-center justify-between mb-6"><h3 className="text-2xl font-bold text-gray-900">Route Details & Navigation</h3><button onClick={() => setSelectedRoute(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button></div><div className="space-y-6"><div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><MapPin className="h-6 w-6" /><div><p className="text-sm text-primary-100">From</p><p className="font-bold text-lg">{selectedRoute.from}</p></div></div><Navigation className="h-8 w-8" /><div className="flex items-center gap-3"><div className="text-right"><p className="text-sm text-primary-100">To</p><p className="font-bold text-lg">{selectedRoute.to}</p></div><MapPin className="h-6 w-6" /></div></div><div className="grid grid-cols-3 gap-4"><div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center"><p className="text-2xl font-bold">{selectedRoute.distance}</p><p className="text-sm text-primary-100">Distance</p></div><div className="bg:white/20 backdrop-blur rounded-lg p-3 text-center bg-white/20"><p className="text-2xl font-bold">{selectedRoute.duration}</p><p className="text-sm text-primary-100">Duration</p></div><div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center"><p className="text-2xl font-bold">{selectedRoute.safetyScore}%</p><p className="text-sm text-primary-100">Safety</p></div></div></div><div><h4 className="font-bold text-lg mb-3">📍 Turn-by-Turn Directions</h4><div className="space-y-2">{selectedRoute.turnByTurn.map((direction, idx) => (<div key={idx} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg"><div className="h-8 w-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{idx + 1}</div><p className="text-gray-700 pt-1">{direction}</p></div>))}</div></div><div className="bg-success-50 border-2 border-success-300 rounded-lg p-4"><h4 className="font-bold text-success-900 mb-2">✅ Safety Features on This Route</h4><ul className="space-y-1">{selectedRoute.highlights.map((highlight, idx) => (<li key={idx} className="flex items-center gap-2 text-success-800"><CheckCircle className="h-4 w-4" /><span>{highlight}</span></li>))}</ul></div><div className="flex gap-3"><button className="flex-1 btn-primary"><Navigation className="inline h-5 w-5 mr-2" />Start Navigation</button><button className="flex-1 bg-success-600 text-white px-4 py-3 rounded-lg font-semibold">Share Route</button></div></div></div></div>
        </div>
      )}
    </div>
  );
}

export default SafeRoutes;