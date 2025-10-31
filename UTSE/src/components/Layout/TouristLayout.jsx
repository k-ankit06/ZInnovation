import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { 
  Globe, LayoutDashboard, FileText, Shield, AlertTriangle, Map, CreditCard, Languages,
  LogOut, Bell, User, MapPin, Edit 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TouristLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user?.isRegistered && location.pathname !== '/tourist/registration') {
      navigate('/tourist/registration');
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const menuItems = [
    { path: '/tourist/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tourist/registration', icon: FileText, label: 'Tourist Registration' },
    { path: '/tourist/my-card', icon: CreditCard, label: 'My Tourist Card' },
    { path: '/tourist/safety', icon: Shield, label: 'Safety Information' },
    { path: '/tourist/emergency', icon: AlertTriangle, label: 'Emergency Help' },
    { path: '/tourist/safe-routes', icon: MapPin, label: 'Safe Routes' },
    { path: '/tourist/guide', icon: Map, label: 'Travel Guide' },
    { path: '/tourist/translator', icon: Languages, label: 'Language Translator' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg sticky top-0 z-50"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="p-2 bg-white rounded-full shadow-md">
              <Globe className="h-8 w-8 text-primary-600" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">Tourist Safety Portal</h1>
              <p className="text-sm text-primary-100">Your safety companion 🌟</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              className="relative p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-3 w-3 bg-danger-500 rounded-full border-2 border-primary-600 animate-pulse"></span>
            </motion.button>
            
            <div className="relative pl-4 border-l border-primary-400" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="flex items-center space-x-3"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-primary-100">{user?.country || 'Tourist'}</p>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <User className="h-6 w-6 text-primary-600" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    <Link to="/tourist/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-72 bg-white shadow-xl min-h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto"
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <motion.li 
                    key={item.path}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all shadow-md hover:shadow-lg ${
                        isActive 
                          ? 'bg-primary-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      title={item.label}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
        </motion.aside>

        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-6 bg-white/50 rounded-lg m-4 shadow-xl"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}

export default TouristLayout;