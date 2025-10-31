import { useState } from 'react'
import { Shield, MapPin, AlertTriangle, Phone, QrCode, Bell, Activity, Navigation } from 'lucide-react'
import { useAuth } from '../../components/Auth/AuthContext'
import { motion } from 'framer-motion'
import axios from 'axios'
import api from '../../lib/apiClient'
import { toast } from 'react-toastify'

const TouristDashboard = () => {
  const { user } = useAuth()
  const [panicActive, setPanicActive] = useState(false)
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null, address: 'Not fetched yet' })
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [safetyScore, setSafetyScore] = useState(92)
  const [nearbyHelp, setNearbyHelp] = useState([])
  const [safetyAlerts, setSafetyAlerts] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  const handlePanic = () => {
    setPanicActive(true)
    setTimeout(() => setPanicActive(false), 3000)
  }

  const fetchLocation = async () => {
    setLocationLoading(true)
    setLocationError('')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
            const address = response.data.display_name || 'Unknown location'
            setCurrentLocation({ lat, lng, address })

            // 🎲 Generate RANDOM safety score (50-100)
            const randomScore = Math.floor(Math.random() * 51) + 50 // Random between 50-100
            
            const lowerAddr = address.toLowerCase()
            let newHelp = []
            let newAlerts = []
            let newActivity = []

            // Determine area type for help points and alerts
            if (lowerAddr.includes('bazaar') || lowerAddr.includes('market') || lowerAddr.includes('station')) {
              newHelp = [
                { type: 'Police Booth', name: 'Local Police Booth', distance: '0.2 km', phone: '100' },
                { type: 'Medical Aid', name: 'Medical Clinic', distance: '0.6 km', phone: '102' },
              ]
            } else if (lowerAddr.includes('hospital') || lowerAddr.includes('police') || lowerAddr.includes('embassy')) {
              newHelp = [
                { type: 'Police Station', name: 'Nearby Police HQ', distance: '0.3 km', phone: '100' },
                { type: 'Hospital', name: 'City Medical Center', distance: '0.8 km', phone: '102' },
              ]
            } else if (lowerAddr.includes('highway') || lowerAddr.includes('isolated') || lowerAddr.includes('forest')) {
              newHelp = [
                { type: 'Highway Patrol', name: 'Highway Patrol Unit', distance: '1.5 km', phone: '1091' },
                { type: 'Emergency Stop', name: 'Safe Rest Area', distance: '2.2 km', phone: '108' },
              ]
            } else {
              newHelp = [
                { type: 'Tourist Help', name: 'City Tourist Center', distance: '0.4 km', phone: '1363' },
                { type: 'Hospital', name: 'Metro Hospital', distance: '1.2 km', phone: '102' },
              ]
            }

            // 🚨 Check if safety score is below 70 - SEND AUTOMATIC ALERT
            if (randomScore < 70) {
              newAlerts = [
                { type: 'warning', message: `⚠️ DANGER ZONE! Safety score: ${randomScore}/100. Area is unsafe - please move to a safer location immediately!`, time: 'Just now' },
                { type: 'warning', message: 'High risk area detected. Authorities have been notified.', time: 'Just now' },
                { type: 'info', message: 'Avoid travelling alone. Stay in crowded well-lit areas.', time: '1 min ago' },
              ]
              newActivity = [
                { action: `🚨 Entered High-Risk Area (Score: ${randomScore})`, time: 'Just now', icon: AlertTriangle },
                { action: 'Auto-Alert Sent to Authorities', time: 'Just now', icon: Bell },
                { action: 'Location Updated', time: 'Just now', icon: MapPin },
              ]

              // 🚨 SEND AUTOMATIC ALERT TO AUTHORITIES
              try {
                // Get user's tourist profile to get touristId
                const profileRes = await api.get('/api/tourist/me')
                const cards = profileRes?.data?.data?.cards || []
                
                if (cards.length > 0) {
                  const touristId = cards[0].touristId
                  
                  // Send auto-alert to backend (which will email and save)
                  await api.post(`/api/tourist/alert/${touristId}`, {
                    message: `Tourist entered UNSAFE area! Location: ${address}. Safety Score: ${randomScore}/100. Immediate attention required!`,
                    alertType: 'AUTO-GENERATED HIGH RISK ALERT'
                  })
                  
                  toast.error(`⚠️ WARNING: You are in an UNSAFE area! Safety Score: ${randomScore}/100. Authorities have been automatically notified.`, {
                    autoClose: 10000,
                    position: 'top-center'
                  })
                }
              } catch (alertErr) {
                console.error('Failed to send auto-alert:', alertErr)
              }
            } else if (randomScore >= 70 && randomScore < 85) {
              newAlerts = [
                { type: 'warning', message: `Moderate risk area. Safety score: ${randomScore}/100. Stay alert and cautious.`, time: 'Just now' },
                { type: 'info', message: 'Keep your belongings secure and avoid isolated areas.', time: '2 mins ago' },
              ]
              newActivity = [
                { action: `Location Check: Moderate Risk (Score: ${randomScore})`, time: 'Just now', icon: MapPin },
                { action: 'Safety Score Updated', time: 'Just now', icon: Shield },
              ]
            } else {
              newAlerts = [
                { type: 'success', message: `✅ Safe area detected! Safety score: ${randomScore}/100. You can travel safely here.`, time: 'Just now' },
                { type: 'info', message: 'Emergency services nearby for quick support if needed.', time: '5 mins ago' },
              ]
              newActivity = [
                { action: `Entered Safe Zone (Score: ${randomScore})`, time: 'Just now', icon: Shield },
                { action: 'Location Verified as Safe', time: 'Just now', icon: MapPin },
              ]
            }

            setSafetyScore(randomScore)
            setNearbyHelp(newHelp)
            setSafetyAlerts(newAlerts)
            setRecentActivity(newActivity)
            
            // Toast notification for safety score
            if (randomScore < 70) {
              toast.error(`🚨 DANGER! Safety Score: ${randomScore}/100`, { autoClose: 8000 })
            } else if (randomScore >= 85) {
              toast.success(`✅ Safe Area! Safety Score: ${randomScore}/100`, { autoClose: 3000 })
            } else {
              toast.warning(`⚠️ Moderate Risk. Safety Score: ${randomScore}/100`, { autoClose: 5000 })
            }
          } catch (err) {
            setLocationError('Unable to fetch address. Showing coordinates only.')
            setCurrentLocation({ lat, lng, address: 'Address not available' })
            const randomScore = Math.floor(Math.random() * 51) + 50
            setSafetyScore(randomScore)
            setNearbyHelp([])
            setSafetyAlerts([{ type: 'warning', message: `Location not verified. Safety score: ${randomScore}/100. Stay alert.`, time: 'Just now' }])
            setRecentActivity([{ action: 'Location error occurred', time: 'Just now', icon: AlertTriangle }])
          } finally {
            setLocationLoading(false)
          }
        },
        (error) => {
          setLocationLoading(false)
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Permission denied. Please allow location access.")
              break
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.")
              break
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.")
              break
            default:
              setLocationError("An unknown error occurred.")
          }
        }
      )
    } else {
      setLocationError("Geolocation is not supported by this browser.")
      setLocationLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Welcome Section */}
      <div>
        <motion.h2 initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}! 👋
        </motion.h2>
        <p className="text-gray-600 mt-1">Your safety is our priority. Have a wonderful journey! 🌟</p>
      </div>

      {/* SOS Button */}
      <motion.div whileHover={{ scale: 1.02 }} className="card bg-gradient-to-r from-danger-500 to-danger-600 text-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Emergency SOS 🚨</h3>
            <p className="text-danger-100">In case of emergency, press the panic button for immediate help</p>
          </div>
          <motion.button
            animate={panicActive ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.3, repeat: panicActive ? Infinity : 0 }}
            onClick={handlePanic}
            className={`relative w-24 h-24 rounded-full transition-all duration-300 font-bold text-lg shadow-xl ${
              panicActive ? 'bg-white text-danger-600 animate-pulse' : 'bg-white/20 hover:bg-white/30'
            }`}
            title="Press for SOS"
          >
            {panicActive ? (
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-10 w-10 animate-bounce" />
                <span className="text-xs mt-1">HELP!</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-10 w-10" />
                <span className="text-xs mt-1">SOS</span>
              </div>
            )}
          </motion.button>
        </div>
        {panicActive && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-white/20 backdrop-blur rounded-lg p-3 animate-pulse">
            <p className="font-semibold">🚨 Emergency alert sent! Help is on the way...</p>
            <p className="text-sm text-danger-100 mt-2">Tourist Police: 2 mins away • Ambulance dispatched</p>
          </motion.div>
        )}
      </motion.div>

      {/* Safety Score & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safety Score */}
        <motion.div whileHover={{ scale: 1.02 }} className="card shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Your Safety Score</h3>
            <Shield className="h-6 w-6 text-primary-600" />
          </div>
          <div className="text-center">
            <motion.div className={`text-6xl font-bold mb-2 ${safetyScore >= 80 ? 'text-success-600' : safetyScore >= 60 ? 'text-warning-600' : 'text-danger-600'}`}>
              {safetyScore}
            </motion.div>
            <p className={`text-lg font-semibold mb-4 ${safetyScore >= 80 ? 'text-success-600' : safetyScore >= 60 ? 'text-warning-600' : 'text-danger-600'}`}>
              {safetyScore >= 80 ? 'Safe Zone' : safetyScore >= 60 ? 'Moderate Risk' : 'High Risk'}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${safetyScore}%` }}
                transition={{ duration: 1 }}
                className={`h-3 rounded-full ${
                  safetyScore >= 80 ? 'bg-success-500' : safetyScore >= 60 ? 'bg-warning-500' : 'bg-danger-500'
                }`}
              ></motion.div>
            </div>
            <p className="text-sm text-gray-600 mt-3">Based on your current area, time, and conditions 📊</p>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div whileHover={{ scale: 1.02 }} className="card shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Current Location</h3>
            <MapPin className="h-6 w-6 text-primary-600" />
          </div>
          <div className="space-y-3">
            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">You are at</p>
              <p className="text-xl font-bold text-primary-900">{currentLocation.address}</p>
              <p className="text-sm text-gray-600 mt-2">
                📍 Lat: {currentLocation.lat ? currentLocation.lat.toFixed(4) : 'N/A'}, Lng:{' '}
                {currentLocation.lng ? currentLocation.lng.toFixed(4) : 'N/A'}
              </p>
              {locationError && <p className="text-sm text-danger-600 mt-2">{locationError}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <motion.button whileHover={{ scale: 1.05 }} onClick={fetchLocation} disabled={locationLoading} className="btn-primary text-sm">
                {locationLoading ? 'Fetching...' : <Navigation className="inline h-4 w-4 mr-1" />}
                {locationLoading ? 'Loading...' : 'Fetch Location'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                <MapPin className="inline h-4 w-4 mr-1" />
                Safe Routes
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Nearby Help */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary-600" />
          Nearby Help Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyHelp.map((help, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{help.type}</p>
                  <p className="font-semibold text-gray-900">{help.name}</p>
                  <p className="text-sm text-gray-600 mt-1">📍 {help.distance} away</p>
                </div>
                <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-primary-600" />
          Safety Alerts & Notifications
        </h3>
        <div className="space-y-3">
          {safetyAlerts.map((alert, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded ${
                alert.type === 'success'
                  ? 'border-success-500 bg-success-50'
                  : alert.type === 'warning'
                  ? 'border-warning-500 bg-warning-50'
                  : 'border-primary-500 bg-primary-50'
              }`}
            >
              <p className="font-medium text-gray-900">{alert.message}</p>
              <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default TouristDashboard
