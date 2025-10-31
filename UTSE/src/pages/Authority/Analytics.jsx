import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Users, AlertTriangle } from 'lucide-react'

const AuthorityAnalytics = () => {
  const monthlyData = [
    { month: 'Jan', tourists: 2400, incidents: 45, resolved: 42, revenue: 12000 },
    { month: 'Feb', tourists: 2210, incidents: 38, resolved: 36, revenue: 11000 },
    { month: 'Mar', tourists: 2780, incidents: 42, resolved: 40, revenue: 14000 },
    { month: 'Apr', tourists: 3100, incidents: 35, resolved: 34, revenue: 15500 },
    { month: 'May', tourists: 3500, incidents: 28, resolved: 28, revenue: 17500 },
    { month: 'Jun', tourists: 3800, incidents: 22, resolved: 22, revenue: 19000 },
  ]

  const incidentTypes = [
    { name: 'Medical', value: 35, color: '#ef4444' },
    { name: 'Theft', value: 25, color: '#f59e0b' },
    { name: 'Lost Tourist', value: 20, color: '#3b82f6' },
    { name: 'Language', value: 12, color: '#8b5cf6' },
    { name: 'Others', value: 8, color: '#10b981' },
  ]

  const locationData = [
    { location: 'Taj Mahal', tourists: 4500, incidents: 12 },
    { location: 'India Gate', tourists: 3800, incidents: 18 },
    { location: 'Red Fort', tourists: 3200, incidents: 22 },
    { location: 'Qutub Minar', tourists: 2500, incidents: 8 },
    { location: 'Gateway of India', tourists: 4200, incidents: 15 },
  ]

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics & Insights</h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Comprehensive data analysis and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-xs sm:text-sm">Total Tourists (YTD)</p>
              <p className="text-2xl sm:text-4xl font-bold mt-1">18,790</p>
              <p className="text-xs sm:text-sm text-primary-200 mt-1">↑ 24% vs last year</p>
            </div>
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary-200" />
          </div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-xs sm:text-sm">Resolution Rate</p>
              <p className="text-2xl sm:text-4xl font-bold mt-1">96.5%</p>
              <p className="text-xs sm:text-sm text-success-200 mt-1">↑ 3.2% improvement</p>
            </div>
            <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-success-200" />
          </div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-xs sm:text-sm">Avg Response Time</p>
              <p className="text-2xl sm:text-4xl font-bold mt-1">3.2min</p>
              <p className="text-xs sm:text-sm text-warning-200 mt-1">↓ 18% faster</p>
            </div>
            <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-warning-200" />
          </div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm">Safety Score</p>
              <p className="text-2xl sm:text-4xl font-bold mt-1">94.2%</p>
              <p className="text-xs sm:text-sm text-purple-200 mt-1">↑ 2.8% increase</p>
            </div>
            <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="text-lg sm:text-xl font-bold mb-3">Tourist & Incident Trends</h3>
          <div className="w-full h-64 sm:h-72 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="tourists" stroke="#3b82f6" strokeWidth={2} name="Tourists" />
                <Line yAxisId="right" type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} name="Incidents" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-lg sm:text-xl font-bold mb-3">Incident Distribution by Type</h3>
          <div className="w-full h-64 sm:h-72 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incidentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="text-lg sm:text-xl font-bold mb-3">Location-wise Analysis</h3>
          <div className="w-full h-64 sm:h-72 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" angle={-25} textAnchor="end" height={60} interval={0} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tourists" fill="#3b82f6" name="Tourists" />
                <Bar dataKey="incidents" fill="#ef4444" name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-lg sm:text-xl font-bold mb-3">Resolution Performance</h3>
          <div className="w-full h-64 sm:h-72 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="incidents" stroke="#f59e0b" strokeWidth={2} name="Total Incidents" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-lg sm:text-xl font-bold mb-3">Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold">Metric</th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold">Current</th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold">Target</th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-3 px-3 sm:px-4">Average Response Time</td>
                <td className="py-3 px-3 sm:px-4 font-semibold">3.2 minutes</td>
                <td className="py-3 px-3 sm:px-4">5 minutes</td>
                <td className="py-3 px-3 sm:px-4">
                  <span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs sm:text-sm font-semibold">Achieved</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-3 px-3 sm:px-4">Incident Resolution Rate</td>
                <td className="py-3 px-3 sm:px-4 font-semibold">96.5%</td>
                <td className="py-3 px-3 sm:px-4">95%</td>
                <td className="py-3 px-3 sm:px-4">
                  <span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs sm:text-sm font-semibold">Achieved</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-3 px-3 sm:px-4">Tourist Satisfaction</td>
                <td className="py-3 px-3 sm:px-4 font-semibold">91.2%</td>
                <td className="py-3 px-3 sm:px-4">90%</td>
                <td className="py-3 px-3 sm:px-4">
                  <span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs sm:text-sm font-semibold">Achieved</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-3 px-3 sm:px-4">Safety Score</td>
                <td className="py-3 px-3 sm:px-4 font-semibold">94.2%</td>
                <td className="py-3 px-3 sm:px-4">95%</td>
                <td className="py-3 px-3 sm:px-4">
                  <span className="px-2 py-1 bg-warning-100 text-warning-700 rounded-full text-xs sm:text-sm font-semibold">Near Target</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AuthorityAnalytics