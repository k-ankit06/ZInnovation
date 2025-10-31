import { Shield, AlertTriangle, Phone, MapPin, Heart, Sun, Droplet, Wind, Users } from 'lucide-react'
import { useState } from 'react';
import { useAuth } from '../../components/Auth/AuthContext'; 
import { toast } from 'react-toastify';
import api from '../../lib/apiClient';

const SafetyInfo = () => {
  const { user } = useAuth();
  const [loadingService, setLoadingService] = useState(null);

  const safetyTips = [
    { category: 'General Safety', icon: Shield, color: 'primary', tips: [
      'Always keep your Tourist ID card and QR code accessible',
      'Share your itinerary with family or friends',
      'Keep copies of important documents (passport, visa, etc.)',
      'Avoid carrying large amounts of cash',
      'Use hotel safes for valuables',
      'Stay aware of your surroundings at all times'
    ]},
    { category: 'Health & Medical', icon: Heart, color: 'danger', tips: [
      'Drink only bottled or purified water',
      'Carry necessary medications with prescriptions',
      'Get travel insurance before your trip',
      'Know your blood group and allergies',
      'Avoid street food if you have a sensitive stomach',
      'Keep emergency medical contacts handy'
    ]},
    { category: 'Weather Precautions', icon: Sun, color: 'warning', tips: [
      'Stay hydrated in hot weather (drink 3-4 liters of water daily)',
      'Use sunscreen (SPF 30+) and wear hats',
      'Avoid outdoor activities during peak heat (12 PM - 3 PM)',
      'Carry an umbrella for rain and sun protection',
      'Wear light, breathable clothing in summer',
      'Check weather forecasts daily'
    ]},
    { category: 'Travel Safety', icon: MapPin, color: 'success', tips: [
      'Use authorized taxi services or ride-sharing apps',
      'Avoid traveling alone late at night',
      'Keep your phone charged at all times',
      'Learn basic local phrases for emergencies',
      'Inform hotel staff about your daily plans',
      'Use GPS tracking and share location with trusted contacts'
    ]},
    { category: 'Cultural Awareness', icon: Users, color: 'purple', tips: [
      'Dress modestly when visiting religious places',
      'Remove shoes before entering temples and homes',
      'Ask permission before photographing people',
      'Respect local customs and traditions',
      'Avoid public displays of affection',
      'Learn about local festivals and holidays'
    ]}
  ];

  const emergencyNumbers = [
    { service: 'Police Emergency', number: '100', icon: '🚓' },
    { service: 'Ambulance', number: '102', icon: '🚑' },
    { service: 'Fire Brigade', number: '101', icon: '🚒' },
    { service: 'Women Helpline', number: '1091', icon: '👮‍♀️' },
    { service: 'Tourist Helpline', number: '1363', icon: '🏛️' },
    { service: 'Child Helpline', number: '1098', icon: '👶' },
    { service: 'Disaster Management', number: '108', icon: '⚠️' },
    { service: 'Senior Citizen Helpline', number: '1091', icon: '👴' }
  ];

  const handleEmergencyClick = (contact) => {
    setLoadingService(contact.service);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setLoadingService(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendAlert(latitude, longitude, contact);
      },
      (error) => {
        toast.error("Could not get your location. Please enable location services in your browser.");
        console.error("Geolocation Error:", error);
        setLoadingService(null);
      }
    );
  };

  const sendAlert = async (latitude, longitude, contact) => {
    try {
      // Token auto-attach via apiClient interceptor
      const { data } = await api.post('/api/emergency/alert', {
        latitude,
        longitude,
        service: contact.service
      });

      const eta = data?.data?.eta ?? data?.eta ?? 'few';
      toast.success(`Help is on the way! Estimated arrival: ${eta} minutes.`);
      window.location.href = `tel:${contact.number}`;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send alert. Please try again.";
      toast.error(errorMessage);
      console.error("API Error:", error);
    } finally {
      setLoadingService(null);
    }
  };

  const dosDonts = {
    dos: [
      'Do carry your identification documents always',
      'Do inform local police about your stay',
      'Do use authorized money exchange services',
      'Do bargain politely at local markets',
      'Do try local cuisine at reputable restaurants',
      'Do learn basic Hindi phrases',
      'Do respect queue systems',
      'Do tip service staff appropriately (10-15%)'
    ],
    donts: [
      "Don't accept food/drinks from strangers",
      "Don't share personal details with unknown people",
      "Don't use unlicensed tour guides",
      "Don't venture into isolated areas alone",
      "Don't leave belongings unattended",
      "Don't take photographs of military installations",
      "Don't give money to beggars (donate to NGOs instead)",
      "Don't argue with authorities"
    ]
  };

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-600',
      danger: 'bg-danger-100 text-danger-600',
      warning: 'bg-warning-100 text-warning-600',
      success: 'bg-success-100 text-success-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Safety Information</h2>
        <p className="text-gray-600 mt-1">Essential tips and guidelines for a safe journey in India</p>
      </div>

      <div className="card bg-gradient-to-r from-danger-500 to-danger-600 text-white">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <Phone className="h-6 w-6 mr-2" />
          Emergency Contact Numbers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emergencyNumbers.map((contact) => (
            <button
              key={contact.service}
              onClick={() => handleEmergencyClick(contact)}
              disabled={loadingService === contact.service}
              className="bg-white/20 backdrop-blur rounded-lg p-4 text-center hover:bg-white/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingService === contact.service ? (
                <div className="flex justify-center items-center h-full">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-2">{contact.icon}</div>
                  <p className="text-sm text-danger-100 mb-1">{contact.service}</p>
                  <p className="text-2xl font-bold font-mono">{contact.number}</p>
                </>
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 bg-white/20 backdrop-blur rounded-lg p-3">
          <p className="text-sm">
            <strong>Note:</strong> All emergency numbers are toll-free and available 24/7. Save these numbers in your phone immediately.
          </p>
        </div>
      </div>

      {safetyTips.map((category, index) => {
        const Icon = category.icon;
        return (
          <div key={index} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(category.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.tips.map((tip, tipIndex) => (
                <div key={tipIndex} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                  <div className="h-2 w-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card border-2 border-success-300">
          <h3 className="text-xl font-bold text-success-700 mb-4 flex items-center">
            ✅ Do's - Follow These
          </h3>
          <ul className="space-y-3">
            {dosDonts.dos.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-success-600 font-bold mt-1">✓</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card border-2 border-danger-300">
          <h3 className="text-xl font-bold text-danger-700 mb-4 flex items-center">
            ❌ Don'ts - Avoid These
          </h3>
          <ul className="space-y-3">
            {dosDonts.donts.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-danger-600 font-bold mt-1">✗</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-warning-500 to-warning-600 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Sun className="h-6 w-6 mr-2" />
          Current Weather Safety Alert
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-warning-100">Temperature</span>
              <Sun className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">42°C</p>
            <p className="text-sm text-warning-100 mt-1">Extreme Heat Warning</p>
          </div>
          <div className="bg:white/20 backdrop-blur rounded-lg p-4 bg-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-warning-100">Humidity</span>
              <Droplet className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">65%</p>
            <p className="text-sm text-warning-100 mt-1">Moderate Humidity</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-warning-100">Air Quality</span>
              <Wind className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">AQI 85</p>
            <p className="text-sm text-warning-100 mt-1">Moderate - Sensitive people should limit outdoor activity</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold mb-4">Essential Documents Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Valid Passport with 6 months validity',
            'Valid Indian Visa',
            'Tourist ID Card & QR Code',
            'Travel Insurance Documents',
            'Hotel Booking Confirmations',
            'Return Flight Tickets',
            'Emergency Contact List',
            'Medical Prescriptions (if any)',
            'Credit/Debit Cards',
            'International Driving Permit (if driving)'
          ].map((doc, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <input type="checkbox" className="h-5 w-5 text-primary-600" />
              <span className="text-gray-700">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-primary-50 border-2 border-primary-300">
        <h4 className="font-bold text-primary-900 mb-3">💡 Quick Safety Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-primary-800">
          <div>
            <p className="font-semibold mb-1">🚨 In Emergency</p>
            <p>Press the SOS button on your dashboard or call 100 (Police) immediately</p>
          </div>
          <div>
            <p className="font-semibold mb-1">📱 Stay Connected</p>
            <p>Keep your phone charged and enable location services for safety tracking</p>
          </div>
          <div>
            <p className="font-semibold mb-1">🗺️ Plan Ahead</p>
            <p>Check safe routes and current safety scores before visiting new locations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SafetyInfo