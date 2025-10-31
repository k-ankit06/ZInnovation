import { useState } from 'react'
import { AlertTriangle, Phone, MapPin, Clock, User, CheckCircle, XCircle } from 'lucide-react'

const EmergencyResponse = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [selectedIncident, setSelectedIncident] = useState(null)

  const emergencies = [
    {
      id: 1, type: 'Medical Emergency', severity: 'Critical', tourist: 'John Anderson', country: 'USA', location: 'Taj Mahal, Agra', coordinates: '27.1751° N, 78.0421° E', phone: '+1 555-0123', description: 'Tourist collapsed, needs immediate medical attention', time: '2 mins ago', status: 'active', assignedTeam: 'Medical Team Alpha', responseTime: '00:02:15', distance: '0.5 km'
    },
    {
      id: 2, type: 'Lost Tourist', severity: 'Medium', tourist: 'Sarah Williams', country: 'UK', location: 'Red Fort, Delhi', coordinates: '28.6562° N, 77.2410° E', phone: '+44 20 7123 4567', description: 'Tourist separated from group, cannot find way back', time: '15 mins ago', status: 'active', assignedTeam: 'Patrol Team Bravo', responseTime: '00:15:30', distance: '1.2 km'
    },
    {
      id: 3, type: 'Theft Report', severity: 'High', tourist: 'Hans Mueller', country: 'Germany', location: 'Gateway of India, Mumbai', coordinates: '18.9220° N, 72.8347° E', phone: '+49 30 12345678', description: 'Wallet and passport stolen, tourist in distress', time: '30 mins ago', status: 'active', assignedTeam: 'Police Unit Charlie', responseTime: '00:30:45', distance: '2.1 km'
    },
    {
      id: 4, type: 'Accident', severity: 'Critical', tourist: 'Maria Rodriguez', country: 'Spain', location: 'Marine Drive, Mumbai', coordinates: '18.9432° N, 72.8236° E', phone: '+34 91 123 4567', description: 'Tourist involved in vehicle accident, minor injuries', time: '5 mins ago', status: 'responding', assignedTeam: 'Ambulance Unit Delta', responseTime: '00:05:20', distance: '0.8 km'
    },
  ]

  const resolvedEmergencies = [
    {
      id: 5, type: 'Language Barrier', severity: 'Low', tourist: 'Takeshi Yamamoto', country: 'Japan', location: 'Hawa Mahal, Jaipur', phone: '+81 3 1234 5678', description: 'Tourist needs translator assistance', time: '2 hours ago', status: 'resolved', assignedTeam: 'Language Support Echo', responseTime: '00:08:15', resolutionTime: '00:25:30'
    },
    {
      id: 6, type: 'Health Issue', severity: 'Medium', tourist: 'Emma Wilson', country: 'Australia', location: 'Qutub Minar, Delhi', phone: '+61 2 1234 5678', description: 'Tourist feeling unwell, heat exhaustion', time: '3 hours ago', status: 'resolved', assignedTeam: 'Medical Team Alpha', responseTime: '00:04:30', resolutionTime: '00:35:00'
    },
  ]

  const displayEmergencies = activeTab === 'active' ? emergencies : resolvedEmergencies

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'bg-danger-100 text-danger-700 border-danger-300'
      case 'High': return 'bg-warning-100 text-warning-700 border-warning-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'Low': return 'bg-success-100 text-success-700 border-success-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-danger-500'
      case 'responding': return 'bg-warning-500'
      case 'resolved': return 'bg-success-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Emergency Response Center</h2>
          <p className="text-gray-600 mt-1">Real-time emergency incident management and response coordination</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-danger-100 text-danger-700 px-4 py-2 rounded-lg font-semibold">
            <AlertTriangle className="inline h-5 w-5 mr-2" />
            {emergencies.length} Active Emergencies
          </div>
        </div>
      </div>

      <div className="card p-0">
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('active')} className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'active' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
            Active Emergencies ({emergencies.length})
          </button>
          <button onClick={() => setActiveTab('resolved')} className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'resolved' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
            Resolved ({resolvedEmergencies.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayEmergencies.map((emergency) => (
          <div key={emergency.id} className={`card border-l-4 ${emergency.severity === 'Critical' ? 'border-danger-500' : 'border-warning-500'} hover:shadow-xl transition-shadow`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${getSeverityColor(emergency.severity).split(' ')[0]}`}>
                  <AlertTriangle className={`h-8 w-8 ${getSeverityColor(emergency.severity).split(' ')[1]}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{emergency.type}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(emergency.severity)}`}>{emergency.severity}</span>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(emergency.status)} animate-pulse`}></div>
                      <span className="text-sm font-medium text-gray-600 capitalize">{emergency.status}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{emergency.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center gap-2"> <User className="h-4 w-4 text-primary-600" /> <div> <p className="text-xs text-gray-500">Tourist</p> <p className="font-medium text-gray-900">{emergency.tourist}</p> <p className="text-xs text-gray-600">{emergency.country}</p> </div> </div>
                    <div className="flex items-center gap-2"> <MapPin className="h-4 w-4 text-primary-600" /> <div> <p className="text-xs text-gray-500">Location</p> <p className="font-medium text-gray-900">{emergency.location}</p> <p className="text-xs text-gray-600">{emergency.distance}</p> </div> </div>
                    <div className="flex items-center gap-2"> <Phone className="h-4 w-4 text-primary-600" /> <div> <p className="text-xs text-gray-500">Contact</p> <p className="font-medium text-gray-900">{emergency.phone}</p> </div> </div>
                    <div className="flex items-center gap-2"> <Clock className="h-4 w-4 text-primary-600" /> <div> <p className="text-xs text-gray-500">Response Time</p> <p className="font-medium text-gray-900">{emergency.responseTime}</p> <p className="text-xs text-gray-600">{emergency.time}</p> </div> </div>
                  </div>
                  <div className="bg-primary-50 px-4 py-2 rounded-lg"> <p className="text-sm text-primary-900"><span className="font-semibold">Assigned Team:</span> {emergency.assignedTeam}</p> </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {emergency.status !== 'resolved' ? (
                  <>
                    <button className="btn-danger whitespace-nowrap"><Phone className="inline h-4 w-4 mr-1" /> Call Tourist</button>
                    <button className="btn-primary whitespace-nowrap"><MapPin className="inline h-4 w-4 mr-1" /> Track Location</button>
                    <button className="btn-success whitespace-nowrap"><CheckCircle className="inline h-4 w-4 mr-1" /> Mark Resolved</button>
                  </>
                ) : (<div className="bg-success-100 text-success-700 px-4 py-2 rounded-lg font-semibold"><CheckCircle className="inline h-5 w-5 mr-1" /> Resolved</div>)}
                <button onClick={() => setSelectedIncident(emergency)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium whitespace-nowrap">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <h3 className="text-xl font-bold mb-4">Emergency Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-3 rounded-lg transition-colors font-medium">📞 Emergency Hotline</button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-3 rounded-lg transition-colors font-medium">🚑 Dispatch Ambulance</button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-3 rounded-lg transition-colors font-medium">🚓 Police Backup</button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-3 rounded-lg transition-colors font-medium">🏥 Nearby Hospitals</button>
        </div>
      </div>
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Emergency Incident Details</h3>
                <button onClick={() => setSelectedIncident(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
              </div>
              <div className="space-y-6">
                <div className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded">
                  <div className="flex items-center gap-2 mb-2"> <AlertTriangle className="h-6 w-6 text-danger-600" /> <h4 className="text-lg font-bold text-danger-900">{selectedIncident.type}</h4> </div>
                  <p className="text-danger-800">{selectedIncident.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-l-4 border-primary-600 pl-4"><p className="text-sm text-gray-600">Tourist Name</p><p className="font-semibold text-gray-900">{selectedIncident.tourist}</p></div>
                  <div className="border-l-4 border-primary-600 pl-4"><p className="text-sm text-gray-600">Country</p><p className="font-semibold text-gray-900">{selectedIncident.country}</p></div>
                  <div className="border-l-4 border-primary-600 pl-4"><p className="text-sm text-gray-600">Location</p><p className="font-semibold text-gray-900">{selectedIncident.location}</p></div>
                  <div className="border-l-4 border-primary-600 pl-4"><p className="text-sm text-gray-600">Coordinates</p><p className="font-semibold text-gray-900">{selectedIncident.coordinates}</p></div>
                  <div className="border-l-4 border-primary-600 pl-4"><p className="text-sm text-gray-600">Contact Number</p><p className="font-semibold text-gray-900">{selectedIncident.phone}</p></div>
                  <div className="border-l-4 border-primary-600 pl-4"><p className="text-sm text-gray-600">Severity Level</p><p className="font-semibold text-gray-900">{selectedIncident.severity}</p></div>
                  <div className="border-l-4 border-primary-600 pl-4"><p className="text-sm text-gray-600">Response Time</p><p className="font-semibold text-gray-900">{selectedIncident.responseTime}</p></div>
                  <div className="border-l-4 border-primary-600 pl-4"><p className="text-sm text-gray-600">Assigned Team</p><p className="font-semibold text-gray-900">{selectedIncident.assignedTeam}</p></div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Response Timeline</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><div className="h-2 w-2 bg-danger-500 rounded-full"></div><span className="text-sm">Emergency reported - {selectedIncident.time}</span></div>
                    <div className="flex items-center gap-2"><div className="h-2 w-2 bg-warning-500 rounded-full"></div><span className="text-sm">Team dispatched - 1 min after report</span></div>
                    <div className="flex items-center gap-2"><div className="h-2 w-2 bg-success-500 rounded-full"></div><span className="text-sm">Team on location - {selectedIncident.responseTime}</span></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 btn-danger"><Phone className="inline h-4 w-4 mr-2" /> Call Tourist</button>
                  <button className="flex-1 btn-primary"><MapPin className="inline h-4 w-4 mr-2" /> Track Location</button>
                  <button className="flex-1 btn-success"><CheckCircle className="inline h-4 w-4 mr-2" /> Mark Resolved</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmergencyResponse