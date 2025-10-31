import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Globe, AlertCircle } from 'lucide-react'
import { useAuth } from './AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../lib/apiClient'

const SignUp = () => {
  const [userType, setUserType] = useState('tourist')
  const [touristType, setTouristType] = useState('international')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    passportNumber: '',
    aadhaarNumber: '',
    emergencyContactName: '',
    emergencyContact: '',
    departmentId: '',
    designation: ''
  })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      const registrationData = { role: userType, ...formData }
      if (userType === 'tourist') registrationData.touristType = touristType

      const { data } = await api.post('/api/auth/register', registrationData)
      // Save auth
      login(data)

      // Prefill data for registration page (from server prefill or fallback from form)
      if (data.role === 'tourist') {
        const prefill = data.prefill || {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          touristType,
          passportNumber: touristType === 'international' ? formData.passportNumber : '',
          aadhaarNumber: touristType === 'domestic' ? formData.aadhaarNumber : '',
          emergencyContactName: formData.emergencyContactName || '',
          emergencyContactPhone: formData.emergencyContact || ''
        };
        localStorage.setItem('touristPrefill', JSON.stringify(prefill));
      }

      if (data.role === 'tourist' && !data.isRegistered) {
        navigate('/tourist/registration')
      } else {
        navigate(`/${data.role}/dashboard`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, type: 'spring' }
    }),
  }

  const hoverPop = {
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4"
    >
      <motion.div
        className="max-w-2xl w-full"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 1 }}
          >
            <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          </motion.div>
          <motion.h1 className="text-3xl font-bold text-gray-900" variants={fadeInUp} custom={0.3}>
            Create Account
          </motion.h1>
          <motion.p className="text-gray-600 mt-2" variants={fadeInUp} custom={0.4}>
            Join the Tourist Safety System
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div className="bg-white rounded-lg shadow-xl p-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} whileHover={{ scale: 1.02 }}>
          {/* Toggle */}
          <motion.div className="flex mb-6 bg-gray-100 rounded-lg p-1" variants={fadeInUp} custom={0.5}>
            <motion.button whileHover="hover" variants={hoverPop} onClick={() => setUserType('tourist')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${userType === 'tourist' ? 'bg-white shadow-sm text-primary-600 font-medium' : 'text-gray-600'}`}>
              <Globe className="inline h-4 w-4 mr-2" />
              Tourist
            </motion.button>
            <motion.button whileHover="hover" variants={hoverPop} onClick={() => setUserType('authority')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${userType === 'authority' ? 'bg-white shadow-sm text-primary-600 font-medium' : 'text-gray-600'}`}>
              Authority
            </motion.button>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div key="error" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-4" variants={fadeInUp} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic fields */}
              {[
                { label: 'Full Name', value: 'name' },
                { label: 'Email Address', value: 'email', type: 'email' },
                { label: 'Phone Number', value: 'phone', type: 'tel' },
              ].map((field, i) => (
                <motion.div key={field.value} variants={fadeInUp} custom={i + 0.6}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  <motion.input whileFocus={{ scale: 1.03 }} type={field.type || 'text'} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={formData[field.value]} onChange={(e) => setFormData({ ...formData, [field.value]: e.target.value })} />
                </motion.div>
              ))}

              {/* Tourist fields */}
              <AnimatePresence>
                {userType === 'tourist' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tourist Type</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input type="radio" value="international" checked={touristType === 'international'}
                              onChange={() => setTouristType('international')} className="text-primary-600" /> International
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" value="domestic" checked={touristType === 'domestic'}
                              onChange={() => setTouristType('domestic')} className="text-primary-600" /> Domestic
                          </label>
                        </div>
                      </div>

                      {touristType === 'international' ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                          <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            value={formData.passportNumber} onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value, aadhaarNumber: '' })} />
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                          <input type="text" required maxLength={12} pattern="\d{12}" title="Aadhaar number must be 12 digits"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            value={formData.aadhaarNumber} onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value, passportNumber: '' })} />
                        </motion.div>
                      )}

                      {/* Emergency contact name + phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          value={formData.emergencyContactName} onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                        <input type="tel" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          value={formData.emergencyContact} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Authority fields */}
              <AnimatePresence>
                {userType === 'authority' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department ID</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Passwords */}
              {['password', 'confirmPassword'].map((field, i) => (
                <motion.div key={field} variants={fadeInUp} custom={i + 1}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <motion.input whileFocus={{ scale: 1.03 }} type="password" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} />
                </motion.div>
              ))}
            </div>

            {/* Submit */}
            <motion.button whileHover={{ scale: 1.07, boxShadow: '0px 0px 25px rgba(0,0,0,0.2)' }} whileTap={{ scale: 0.96 }} type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Create {userType === 'tourist' ? 'Tourist' : 'Authority'} Account
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div className="mt-6 text-center" variants={fadeInUp} custom={1.4}>
            <p className="text-gray-600">
              Already have an account?{' '}
              <motion.span whileHover={{ scale: 1.1 }}>
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Login</Link>
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default SignUp