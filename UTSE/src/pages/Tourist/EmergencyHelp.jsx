import { useState } from 'react'
import { Phone, MapPin, Activity, Shield, AlertTriangle, Navigation, Clock } from 'lucide-react'

const EmergencyHelp = () => {
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [panicActivated, setPanicActivated] = useState(false)

  const emergencyContacts = [
    {
      id: 1,
      type: 'Police Emergency',
      number: '100',
      icon: Shield,
      color: 'primary',
      description: 'For crime, theft, or security emergencies',
      avgResponseTime: '5-8 minutes',
      available247: true
    },
    {
      id: 2,
      type: 'Medical Emergency',
      number: '102',
      icon: Activity,
      color: 'danger',
      description: 'For medical emergencies and ambulance services',
      avgResponseTime: '8-12 minutes',
      available247: true
    },
    {
      id: 3,
      type: 'Tourist Police',
      number: '1363',
      icon: Shield,
      color: 'purple',
      description: 'Dedicated helpline for tourist assistance',
      avgResponseTime: '3-5 minutes',
      available247: true
    },
    {
      id: 4,
      type: 'Women Helpline',
      number: '1091',
      icon: AlertTriangle,
      color: 'danger',
      description: 'Emergency helpline for women in distress',
      avgResponseTime: '5-7 minutes',
      available247: true
    }
  ]

  const nearbyEmergencyServices = [
    {
      name: 'District Hospital Agra',
      type: 'Hospital',
      distance: '2.1 km',
      address: 'MG Road, Agra',
      phone: '+91-562-2226355',
      rating: 4.2,
      facilities: ['Emergency Ward', 'ICU', 'Trauma Center']
    },
    {
      name: 'Taj Ganj Police Station',
      type: 'Police',
      distance: '0.5 km',
      address: 'Near Taj Mahal, Agra',
      phone: '+91-562-2330047',
      rating: 4.0,
      facilities: ['24/7 Service', 'Tourist Help Desk']
    },
    {
      name: 'Pushpanjali Hospital',
      type: 'Hospital',
      distance: '3.5 km',
      address: 'Fatehabad Road, Agra',
      phone: '+91-562-4045454',
      rating: 4.5,
      facilities: ['Emergency', 'Pharmacy', 'Ambulance']
    },
    {
      name: 'Tourist Police Booth',
      type: 'Tourist Help',
      distance: '0.3 km',
      address: 'Taj East Gate',
      phone: '+91-562-2227261',
      rating: 4.8,
      facilities: ['Tourist Assistance', 'Lost & Found']
    }
  ]

  const embassyContacts = [
    { country: 'USA', phone: '+91-11-2419-8000', city: 'New Delhi' },
    { country: 'UK', phone: '+91-11-2419-2100', city: 'New Delhi' },
    { country: 'Canada', phone: '+91-11-4178-2000', city: 'New Delhi' },
    { country: 'Australia', phone: '+91-11-4139-9900', city: 'New Delhi' },
    { country: 'Germany', phone: '+91-11-4479-9199', city: 'New Delhi' },
    { country: 'France', phone: '+91-11-4319-6100', city: 'New Delhi' }
  ]

  const handlePanic = () => {
    setPanicActivated(true)
    
    setTimeout(() => {
      setPanicActivated(false)
    }, 5000)
  }

  const getColorClasses = (color) => {
    const colors = {
      primary: 'from-primary-500 to-primary-600',
      danger: 'from-danger-500 to-danger-600',
      purple: 'from-purple-500 to-purple-600',
      success: 'from-success-500 to-success-600'
    }
    return colors[color] || colors.primary
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Emergency Help</h2>
        <p className="text-gray-600 mt-1">Immediate assistance and emergency contacts at your fingertips</p>
      </div>

      
      <div className="card bg-gradient-to-r from-danger-500 to-danger-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">🚨 Emergency SOS</h3>
            <p className="text-danger-100 mb-4">
              Press this button in case of immediate emergency. Your location will be sent to nearest authorities.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handlePanic}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  panicActivated
                    ? 'bg-white text-danger-600 animate-pulse scale-105'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur'
                } shadow-xl`}
              >
                {panicActivated ? '📡 ALERT SENT!' : '🆘 ACTIVATE SOS'}
              </button>
              <button className="px-6 py-4 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-semibold">
                📞 Call 100
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className={`w-40 h-40 rounded-full flex items-center justify-center ${
              panicActivated ? 'bg-white animate-pulse' : 'bg-white/20 backdrop-blur'
            } shadow-2xl`}>
              <AlertTriangle className={`h-20 w-20 ${panicActivated ? 'text-danger-600' : 'text-white'}`} />
            </div>
          </div>
        </div>
        {panicActivated && (
          <div className="mt-4 bg-white/20 backdrop-blur rounded-lg p-4 animate-pulse">
            <p className="font-bold text-lg">✅ Emergency Alert Activated!</p>
            <p className="text-sm text-danger-100 mt-1">
              📍 Location shared • 🚓 Police notified (ETA: 3 mins) • 🚑 Ambulance on standby • 📞 Emergency contacts alerted
            </p>
          </div>
        )}
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {emergencyContacts.map((contact) => {
          const Icon = contact.icon
          return (
            <div
              key={contact.id}
              className="card cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setSelectedEmergency(contact)}
            >
              <div className={`bg-gradient-to-br ${getColorClasses(contact.color)} text-white rounded-lg p-4 mb-3`}>
                <Icon className="h-8 w-8 mb-2" />
                <p className="font-semibold">{contact.type}</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{contact.number}</p>
              <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{contact.avgResponseTime}</span>
              </div>
              <button className="w-full mt-3 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-semibold">
                📞 Call Now
              </button>
            </div>
          )
        })}
      </div>

    
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <MapPin className="h-6 w-6 mr-2 text-primary-600" />
          Nearby Emergency Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyEmergencyServices.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{service.name}</h4>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                      {service.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{service.address}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{service.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{service.distance}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {service.facilities.map((facility, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {facility}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-semibold text-sm">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Call
                </button>
                <button className="flex-1 bg-success-600 text-white py-2 rounded-lg hover:bg-success-700 font-semibold text-sm">
                  <Navigation className="inline h-4 w-4 mr-1" />
                  Navigate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

  
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Embassy/Consulate Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {embassyContacts.map((embassy, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h4 className="font-bold text-gray-900">{embassy.country}</h4>
                  <p className="text-xs text-gray-600">{embassy.city}</p>
                </div>
              </div>
              <p className="font-mono font-semibold text-primary-600 mb-2">{embassy.phone}</p>
              <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 font-semibold text-sm">
                Call Embassy
              </button>
            </div>
          ))}
        </div>
      </div>


      <div className="card bg-warning-50 border-2 border-warning-300">
        <h3 className="text-xl font-bold text-warning-900 mb-4">⚠️ Emergency Preparedness Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Tourist ID card saved on phone',
            'Emergency contacts programmed in phone',
            'Location services enabled',
            'Phone fully charged',
            'Know your hotel address',
            'Know your blood group',
            'Travel insurance details accessible',
            'Embassy contact number saved'
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg">
              <input type="checkbox" className="h-5 w-5 text-warning-600" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

    
      {selectedEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedEmergency.type}</h3>
                <button
                  onClick={() => setSelectedEmergency(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Emergency Number</p>
                  <p className="text-4xl font-bold text-primary-600">{selectedEmergency.number}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{selectedEmergency.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Response Time</p>
                    <p className="font-semibold text-gray-900">{selectedEmergency.avgResponseTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Availability</p>
                    <p className="font-semibold text-gray-900">
                      {selectedEmergency.available247 ? '24/7' : 'Limited Hours'}
                    </p>
                  </div>
                </div>

                <div className="bg-warning-50 border border-warning-200 p-3 rounded-lg">
                  <p className="text-sm text-warning-900">
                    <strong>Note:</strong> This is a toll-free emergency number. Your location will be automatically shared when you call.
                  </p>
                </div>

                <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-bold text-lg">
                  📞 Call {selectedEmergency.number} Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmergencyHelp
