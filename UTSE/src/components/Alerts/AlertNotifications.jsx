import { useState, useEffect } from 'react';
import { AlertTriangle, X, Bell, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/apiClient';
import { toast } from 'react-toastify';

const AlertNotifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAlerts, setShowAlerts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCriticalBanner, setShowCriticalBanner] = useState(false);
  const [criticalAlertShown, setCriticalAlertShown] = useState(false);

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/tourist/alerts');
      setAlerts(data?.data?.alerts || []);
      setUnreadCount(data?.data?.unreadCount || 0);
      
      // Show critical banner ONLY ONCE when there are new critical unread alerts
      const hasCriticalUnread = (data?.data?.alerts || []).some(a => !a.isRead && a.severity === 'critical');
      if (hasCriticalUnread && !criticalAlertShown) {
        setShowCriticalBanner(true);
        setCriticalAlertShown(true);
        
        // Auto-hide banner after 10 seconds
        setTimeout(() => {
          setShowCriticalBanner(false);
        }, 10000);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Mark alert as read
  const markAsRead = async (alertId) => {
    try {
      await api.patch(`/api/tourist/alerts/${alertId}/read`);
      setAlerts(prev => prev.map(a => 
        a._id === alertId ? { ...a, isRead: true } : a
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Hide critical banner if all alerts are read
      const stillHasCritical = alerts.some(a => !a.isRead && a.severity === 'critical' && a._id !== alertId);
      if (!stillHasCritical) {
        setShowCriticalBanner(false);
      }
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  // Dismiss critical banner manually
  const dismissCriticalBanner = () => {
    setShowCriticalBanner(false);
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Alert Bell Icon */}
      <div className="relative">
        <button
          onClick={() => setShowAlerts(!showAlerts)}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          title="Safety Alerts"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </button>
      </div>

      {/* Alert Panel */}
      <AnimatePresence>
        {showAlerts && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 w-96 max-h-[80vh] bg-white rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="font-bold text-lg">Safety Alerts</h3>
              </div>
              <button onClick={() => setShowAlerts(false)} className="text-white hover:bg-white/20 rounded p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <p>Loading alerts...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No alerts yet</p>
                  <p className="text-sm text-gray-400 mt-1">You'll be notified here about any safety concerns</p>
                </div>
              ) : (
                <div className="divide-y">
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 ${!alert.isRead ? 'bg-red-50' : 'bg-white'} hover:bg-gray-50 transition-colors cursor-pointer`}
                      onClick={() => markAsRead(alert._id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`${getSeverityColor(alert.severity)} p-2 rounded-full`}>
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-sm text-gray-900">{alert.alertType}</p>
                            {!alert.isRead && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(alert.sentAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {alerts.length > 0 && (
              <div className="bg-gray-100 p-3 border-t">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <p>Emergency: <strong>100 (Police)</strong> | <strong>102 (Ambulance)</strong></p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Critical Alert Banner - Only shows ONCE */}
      <AnimatePresence>
        {showCriticalBanner && unreadCount > 0 && alerts.some(a => !a.isRead && a.severity === 'critical') && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 z-[60] shadow-lg"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
                <div>
                  <p className="font-bold">⚠️ CRITICAL SAFETY ALERT!</p>
                  <p className="text-sm">You have urgent notifications. Please check immediately.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowAlerts(true);
                    setShowCriticalBanner(false);
                  }}
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50"
                >
                  View Alert
                </button>
                <button
                  onClick={dismissCriticalBanner}
                  className="text-white hover:bg-red-700 rounded p-2"
                  title="Dismiss"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AlertNotifications;
