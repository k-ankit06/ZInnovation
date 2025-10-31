import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/Auth/AuthContext'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import Login from './components/Auth/Login'
import SignUp from './components/Auth/SignUp'
import SplashScreen from './components/Layout/SplashScreen'
// Authority Pages
import AuthorityLayout from './components/Layout/AuthorityLayout'
import AuthorityDashboard from './pages/Authority/Dashboard'
import TouristMonitoring from './pages/Authority/TouristMonitoring'
import EmergencyResponse from './pages/Authority/EmergencyResponse'
import RiskAssessment from './pages/Authority/RiskAssessment'
import IncidentManagement from './pages/Authority/IncidentManagement'
import SmartIDSystem from './pages/Authority/SmartIDSystem'
import ResponseTeam from './pages/Authority/ResponseTeam'
import AuthorityAnalytics from './pages/Authority/Analytics'
import BlockchainDashboard from './pages/Authority/BlockchainDashboard'

// Tourist Pages
import TouristLayout from './components/Layout/TouristLayout'
import TouristDashboard from './pages/Tourist/Dashboard'
import TouristRegistration from './pages/Tourist/Registration'
import SafetyInfo from './pages/Tourist/SafetyInfo'
import EmergencyHelp from './pages/Tourist/EmergencyHelp'
import TravelGuide from './pages/Tourist/TravelGuide'
import MyTouristCard from './pages/Tourist/MyTouristCard'
import SafeRoutes from './pages/Tourist/SafeRoutes'
import LanguageTranslator from './pages/Tourist/LanguageTranslator'
import { AnimatePresence } from 'framer-motion'  

import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            
            <Route path="/authority" element={
              <ProtectedRoute requiredRole="authority">
                <AuthorityLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AuthorityDashboard />} />
              <Route path="monitoring" element={<TouristMonitoring />} />
              <Route path="emergency" element={<EmergencyResponse />} />
              <Route path="risk" element={<RiskAssessment />} />
              <Route path="incidents" element={<IncidentManagement />} />
              <Route path="analytics" element={<AuthorityAnalytics />} />
              <Route path="smart-id" element={<SmartIDSystem />} />
              <Route path="response-team" element={<ResponseTeam />} />
              <Route path="blockchain" element={<BlockchainDashboard />} />

              
              <Route path="profile" element={<Profile />} />
            </Route>

            
            <Route path="/tourist" element={
              <ProtectedRoute requiredRole="tourist">
                <TouristLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<TouristDashboard />} />
              <Route path="registration" element={<TouristRegistration />} />
              <Route path="safety" element={<SafetyInfo />} />
              <Route path="emergency" element={<EmergencyHelp />} />
              <Route path="guide" element={<TravelGuide />} />
              <Route path="my-card" element={<MyTouristCard />} />
              <Route path="safe-routes" element={<SafeRoutes />} />
              <Route path="translator" element={<LanguageTranslator />} />

              
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
        
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      </AuthProvider>
    </Router>
  )
}

export default App
