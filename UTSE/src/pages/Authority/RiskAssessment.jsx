import { useState } from 'react'
import { Shield, AlertTriangle, TrendingUp, MapPin, Activity } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const RiskAssessment = () => {
  const [selectedLocation, setSelectedLocation] = useState(null)

  const riskData = [
    { month: 'Jan', crime: 12, weather: 8, crowd: 15, overall: 35 },
    { month: 'Feb', crime: 10, weather: 6, crowd: 12, overall: 28 },
    { month: 'Mar', crime: 15, weather: 10, crowd: 18, overall: 43 },
    { month: 'Apr', crime: 8, weather: 12, crowd: 14, overall: 34 },
    { month: 'May', crime: 6, weather: 15, crowd: 10, overall: 31 },
    { month: 'Jun', crime: 5, weather: 18, crowd: 8, overall: 31 },
  ]

  const locations = [
    { id: 1, name: 'Taj Mahal, Agra', riskScore: 25, riskLevel: 'Low', factors: { crime: 15, weather: 20, crowd: 40, health: 10 }, tourists: 450, incidents: 2, recommendations: ['Increased security during peak hours (10 AM - 4 PM)', 'Heat advisory issued - provide water stations', 'Crowd management at entrance gates'] },
    { id: 2, name: 'India Gate, Delhi', riskScore: 35, riskLevel: 'Low', factors: { crime: 20, weather: 25, crowd: 50, health: 15 }, tourists: 380, incidents: 3, recommendations: ['Monitor vendor activities', 'Air quality monitoring required', 'Pickpocket awareness alerts'] },
    { id: 3, name: 'Gateway of India, Mumbai', riskScore: 58, riskLevel: 'Medium', factors: { crime: 45, weather: 30, crowd: 70, health: 25 }, tourists: 520, incidents: 8, recommendations: ['Enhanced police patrol needed', 'Heavy rain warning - slippery surfaces', 'High crowd density - implement flow control'] },
    { id: 4, name: 'Hawa Mahal, Jaipur', riskScore: 42, riskLevel: 'Medium', factors: { crime: 30, weather: 35, crowd: 55, health: 20 }, tourists: 290, incidents: 5, recommendations: ['Extreme heat warning - medical support ready', 'Tourist scam alerts issued', 'Dehydration prevention measures'] },
    { id: 5, name: 'Red Fort, Delhi', riskScore: 72, riskLevel: 'High', factors: { crime: 60, weather: 40, crowd: 85, health: 35 }, tourists: 680, incidents: 12, recommendations: ['CRITICAL: Immediate security reinforcement', 'Stampede risk - restrict entry temporarily', 'Multiple theft reports - heightened vigilance'] },
  ]

  const getRiskColor = (level) => {
    switch(level) {
      case 'Low': return 'text-success-600 bg-success-100';
      case 'Medium': return 'text-warning-600 bg-warning-100';
      case 'High': return 'text-danger-600 bg-danger-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  const getRiskBorderColor = (level) => {
    switch(level) {
      case 'Low': return 'border-success-500';
      case 'Medium': return 'border-warning-500';
      case 'High': return 'border-danger-500';
      default: return 'border-gray-500';
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">AI-Powered Risk Assessment</h2>
        <p className="text-gray-600 mt-1">Real-time predictive analytics and risk monitoring for tourist locations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white"><div className="flex items-center justify-between"><div><p className="text-success-100 text-sm font-medium">Low Risk Areas</p><p className="text-3xl font-bold mt-1">15</p></div><Shield className="h-12 w-12 text-success-200" /></div></div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white"><div className="flex items-center justify-between"><div><p className="text-warning-100 text-sm font-medium">Medium Risk Areas</p><p className="text-3xl font-bold mt-1">8</p></div><AlertTriangle className="h-12 w-12 text-warning-200" /></div></div>
        <div className="card bg-gradient-to-br from-danger-500 to-danger-600 text-white"><div className="flex items-center justify-between"><div><p className="text-danger-100 text-sm font-medium">High Risk Areas</p><p className="text-3xl font-bold mt-1">3</p></div><AlertTriangle className="h-12 w-12 text-danger-200" /></div></div>
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white"><div className="flex items-center justify-between"><div><p className="text-primary-100 text-sm font-medium">Avg Risk Score</p><p className="text-3xl font-bold mt-1">42%</p></div><TrendingUp className="h-12 w-12 text-primary-200" /></div></div>
      </div>
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center"><Activity className="h-5 w-5 mr-2 text-primary-600" />Risk Trends Analysis (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}><LineChart data={riskData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="crime" stroke="#ef4444" strokeWidth={2} name="Crime Risk" /><Line type="monotone" dataKey="weather" stroke="#f59e0b" strokeWidth={2} name="Weather Risk" /><Line type="monotone" dataKey="crowd" stroke="#3b82f6" strokeWidth={2} name="Crowd Risk" /><Line type="monotone" dataKey="overall" stroke="#8b5cf6" strokeWidth={3} name="Overall Risk" /></LineChart></ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Location-wise Risk Assessment</h3>
        <div className="grid grid-cols-1 gap-4">
          {locations.map((location) => (
            <div key={location.id} className={`card border-l-4 ${getRiskBorderColor(location.riskLevel)} hover:shadow-xl transition-shadow`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3"><MapPin className="h-6 w-6 text-primary-600" /><h4 className="text-xl font-bold text-gray-900">{location.name}</h4><span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(location.riskLevel)}`}>{location.riskLevel} Risk</span></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div><p className="text-sm text-gray-600">Risk Score</p><div className="flex items-center gap-2"><p className="text-2xl font-bold text-gray-900">{location.riskScore}%</p><div className={`h-2 w-2 rounded-full ${location.riskLevel === 'Low' ? 'bg-success-500' : location.riskLevel === 'Medium' ? 'bg-warning-500' : 'bg-danger-500'} animate-pulse`}></div></div></div>
                    <div><p className="text-sm text-gray-600">Active Tourists</p><p className="text-2xl font-bold text-gray-900">{location.tourists}</p></div>
                    <div><p className="text-sm text-gray-600">Incidents (24h)</p><p className="text-2xl font-bold text-gray-900">{location.incidents}</p></div>
                    <div><p className="text-sm text-gray-600">Status</p><p className="text-lg font-bold text-primary-600">Active Monitoring</p></div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-3"><p className="font-semibold mb-3 text-gray-900">Risk Factors Breakdown</p><div className="space-y-2"><div><div className="flex items-center justify-between mb-1"><span className="text-sm text-gray-600">Crime Risk</span><span className="text-sm font-semibold">{location.factors.crime}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-danger-500 h-2 rounded-full" style={{ width: `${location.factors.crime}%` }}></div></div></div><div><div className="flex items-center justify-between mb-1"><span className="text-sm text-gray-600">Weather Risk</span><span className="text-sm font-semibold">{location.factors.weather}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-warning-500 h-2 rounded-full" style={{ width: `${location.factors.weather}%` }}></div></div></div><div><div className="flex items-center justify-between mb-1"><span className="text-sm text-gray-600">Crowd Density</span><span className="text-sm font-semibold">{location.factors.crowd}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-500 h-2 rounded-full" style={{ width: `${location.factors.crowd}%` }}></div></div></div><div><div className="flex items-center justify-between mb-1"><span className="text-sm text-gray-600">Health Risk</span><span className="text-sm font-semibold">{location.factors.health}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{ width: `${location.factors.health}%` }}></div></div></div></div></div>
                  <div className={`border-l-4 ${location.riskLevel === 'High' ? 'border-danger-500 bg-danger-50' : location.riskLevel === 'Medium' ? 'border-warning-500 bg-warning-50' : 'border-success-500 bg-success-50'} p-4 rounded`}><p className="font-semibold mb-2 flex items-center"><AlertTriangle className="h-4 w-4 mr-2" />AI-Generated Recommendations</p><ul className="space-y-1">{location.recommendations.map((rec, index) => (<li key={index} className="text-sm flex items-start gap-2"><span className="text-primary-600 mt-1">•</span><span>{rec}</span></li>))}</ul></div>
                </div>
                <div className="flex flex-col gap-2 ml-4"><button onClick={() => setSelectedLocation(location)} className="btn-primary whitespace-nowrap">View Details</button><button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap">Send Alert</button><button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium whitespace-nowrap">View Map</button></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center"><TrendingUp className="h-5 w-5 mr-2" />Predictive Risk Analytics (Next 7 Days)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4"><p className="text-purple-100 text-sm mb-1">Expected High Risk Days</p><p className="text-3xl font-bold">3 days</p><p className="text-sm text-purple-200 mt-1">Weekend crowd surge predicted</p></div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4"><p className="text-purple-100 text-sm mb-1">Weather Risk Alerts</p><p className="text-3xl font-bold">2 locations</p><p className="text-sm text-purple-200 mt-1">Heavy rain forecast</p></div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4"><p className="text-purple-100 text-sm mb-1">Recommended Actions</p><p className="text-3xl font-bold">5 pending</p><p className="text-sm text-purple-200 mt-1">Security enhancements needed</p></div>
        </div>
      </div>
      {selectedLocation && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"><div className="p-6"><div className="flex items-center justify-between mb-6"><h3 className="text-2xl font-bold text-gray-900">Detailed Risk Analysis</h3><button onClick={() => setSelectedLocation(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button></div><div className="space-y-6"><div className={`border-l-4 ${getRiskBorderColor(selectedLocation.riskLevel)} p-4 bg-gray-50 rounded`}><h4 className="text-xl font-bold mb-1">{selectedLocation.name}</h4><span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(selectedLocation.riskLevel)}`}>{selectedLocation.riskLevel} Risk - {selectedLocation.riskScore}% Risk Score</span></div><div className="grid grid-cols-2 gap-4"><div className="card"><p className="text-gray-600 mb-2">Active Tourists</p><p className="text-4xl font-bold text-primary-600">{selectedLocation.tourists}</p></div><div className="card"><p className="text-gray-600 mb-2">Incidents (24h)</p><p className="text-4xl font-bold text-danger-600">{selectedLocation.incidents}</p></div></div><div><h5 className="font-semibold mb-3 text-lg">Detailed Risk Factors</h5><ResponsiveContainer width="100%" height={250}><BarChart data={[{ name: 'Crime', value: selectedLocation.factors.crime }, { name: 'Weather', value: selectedLocation.factors.weather }, { name: 'Crowd', value: selectedLocation.factors.crowd }, { name: 'Health', value: selectedLocation.factors.health },]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#3b82f6" /></BarChart></ResponsiveContainer></div><div className="bg-primary-50 p-4 rounded-lg"><h5 className="font-semibold mb-3 flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-primary-600" />Recommended Actions</h5><ul className="space-y-2">{selectedLocation.recommendations.map((rec, index) => (<li key={index} className="flex items-center gap-2"><div className="h-2 w-2 bg-primary-600 rounded-full"></div><span>{rec}</span></li>))}</ul></div><div className="flex gap-3"><button className="flex-1 btn-primary">Deploy Security Team</button><button className="flex-1 btn-danger">Send Mass Alert</button><button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">View Live Feed</button></div></div></div></div></div>)}
    </div>
  )
}

export default RiskAssessment