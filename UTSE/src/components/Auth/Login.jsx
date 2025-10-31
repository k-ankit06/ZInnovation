import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, User, Lock, Globe, AlertCircle } from 'lucide-react'
import { useAuth } from './AuthContext'
import api from '../../lib/apiClient'
import { motion, AnimatePresence } from 'framer-motion'

const Login = () => {
  const [userType, setUserType] = useState('tourist')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      })
      // Trust backend role; don't overwrite with UI toggle
      login(data)
      navigate(`/${data.role}/dashboard`)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.'
      )
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, type: 'spring' },
    }),
  }

  const hoverScale = {
    hover: { scale: 1.05, rotate: 1, transition: { type: 'spring', stiffness: 300 } },
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <motion.div
          className="text-center mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          <motion.div
            className="inline-block p-4 bg-white rounded-full mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
          >
            <Shield className="h-16 w-16 text-primary-600" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-white mb-2"
            variants={fadeInUp}
            custom={0.5}
          >
            Tourist Safety System
          </motion.h1>
          <motion.p
            className="text-primary-100"
            variants={fadeInUp}
            custom={0.6}
          >
            Protecting tourists, ensuring safety
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.8}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <motion.div
            className="flex mb-6 bg-gray-100 rounded-xl p-1"
            variants={fadeInUp}
            custom={1}
          >
            <motion.button
              whileHover="hover"
              variants={hoverScale}
              onClick={() => setUserType('tourist')}
              className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
                userType === 'tourist'
                  ? 'bg-white shadow-md text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Globe className="inline h-5 w-5 mr-2" />
              Tourist
            </motion.button>

            <motion.button
              whileHover="hover"
              variants={hoverScale}
              onClick={() => setUserType('authority')}
              className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
                userType === 'authority'
                  ? 'bg-white shadow-md text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="inline h-5 w-5 mr-2" />
              Authority
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={fadeInUp}
            custom={1.2}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} custom={1.3}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} custom={1.4}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </motion.div>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0px 0px 20px rgba(0,0,0,0.2)',
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Login as {userType === 'tourist' ? 'Tourist' : 'Authority'}
            </motion.button>
          </motion.form>

          <motion.div
            className="mt-6 text-center"
            variants={fadeInUp}
            custom={1.5}
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <motion.span whileHover={{ scale: 1.1 }}>
                <Link
                  to="/signup"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Sign Up Now
                </Link>
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Login