import { Users, AlertTriangle, Shield, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    danger: 'bg-danger-100 text-danger-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600'
  }
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="card hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 ${trend > 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span className="text-sm font-medium">{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </motion.div>
  )
}

const AuthorityDashboard = () => {
  const incidentData = [
    { month: 'Jan', incidents: 45, resolved: 42 },
    { month: 'Feb', incidents: 38, resolved: 36 },
    { month: 'Mar', incidents: 42, resolved: 40 },
    { month: 'Apr', incidents: 35, resolved: 34 },
    { month: 'May', incidents: 28, resolved: 28 },
    { month: 'Jun', incidents: 22, resolved: 22 },
  ]
  
  const recentIncidents = [
    { id: 1, type: 'Medical Emergency', location: 'Taj Mahal', time: '10 mins ago', status: 'Resolved', tourist: 'John Doe', severity: 'High' },
    { id: 2, type: 'Lost Tourist', location: 'Red Fort', time: '25 mins ago', status: 'In Progress', tourist: 'Sarah Smith', severity: 'Medium' },
    { id: 3, type: 'Theft Report', location: 'Gateway of India', time: '1 hour ago', status: 'Investigating', tourist: 'Mike Johnson', severity: 'High' },
    { id: 4, type: 'Language Barrier', location: 'Hawa Mahal', time: '2 hours ago', status: 'Resolved', tourist: 'Emma Wilson', severity: 'Low' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Real-time tourist safety monitoring and analytics 📊</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Active Tourists" 
          value="2,847" 
          icon={Users} 
          trend={12}
          color="primary"
        />
        <StatsCard 
          title="Active Incidents" 
          value="3" 
          icon={AlertTriangle} 
          trend={-25}
          color="danger"
        />
        <StatsCard 
          title="Safety Score" 
          value="94%" 
          icon={Shield} 
          trend={5}
          color="success"
        />
        <StatsCard 
          title="Avg Response Time" 
          value="2.3 min" 
          icon={Clock} 
          trend={-15}
          color="warning"
        />
      </div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Incident Trends 📈</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={incidentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="incidents" 
                stroke="#3b82f6" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Incidents ⚠️</h3>
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <motion.div 
                key={incident.id}
                whileHover={{ scale: 1.02 }}
                className="p-3 bg-gray-50 rounded-lg shadow"
              >
                <p className="font-semibold">{incident.type}</p>
                <p className="text-sm text-gray-600">{incident.location} - {incident.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AuthorityDashboard