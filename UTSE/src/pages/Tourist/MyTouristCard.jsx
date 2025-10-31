import { useEffect, useState } from 'react';
import { Download, QrCode, CheckCircle, Users } from 'lucide-react';
import QRCodeReact from 'qrcode.react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthContext';
import api from '../../lib/apiClient';
import { toast } from 'react-toastify';

const MyTouristCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tourist profile from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/api/tourist/me');
        if (mounted) setProfile(data?.data || null);
      } catch (e) {
        // Silent fallback to localStorage if API fails
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Local fallback
  const local = JSON.parse(localStorage.getItem('touristData') || '{}');

  // Prefer server profile → then user minimal → then local storage
  const card = profile || (user?.isRegistered ? { touristId: user?.touristId, fullName: user?.name, country: user?.country } : local);

  if (!loading && (!card || !card.touristId)) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <QrCode className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tourist Card Found</h2>
          <p className="text-gray-600 mb-6">Please complete your registration to get your Smart Tourist Card</p>
          <Link to="/tourist/registration" className="btn-primary">Complete Registration</Link>
        </div>
      </div>
    );
  }

  const touristType = (card?.touristType || '').toLowerCase();
  const isDomestic = touristType === 'domestic';
  const idLabel = isDomestic ? 'Aadhaar' : 'Passport';
  const idNumber = isDomestic
    ? (card?.aadhaarNumber || local?.aadhaarNumber)
    : (card?.passportNumber || local?.passportNumber);

  const country = card?.country || local?.country || '';
  const name = card?.fullName || user?.name || local?.fullName || '';
  const touristId = card?.touristId || user?.touristId || local?.touristId;
  const verificationUrl = `${window.location.origin}/verify/${touristId}`;

  const emName = card?.emergencyContactName || local?.emergencyContactName || '';
  const emPhone = card?.emergencyContactPhone || local?.emergencyContactPhone || '';
  const emRel = card?.emergencyContactRelation || local?.emergencyContactRelation || '';

  const downloadQR = () => {
    try {
      // Get QR canvas and download as PNG
      const canvas = document.querySelector('#card-qr-code canvas');
      if (!canvas) return toast.error('QR not ready');
      const link = document.createElement('a');
      link.download = `tourist-card-${touristId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch {
      toast.error('Could not download QR');
    }
  };

  const isGroupRegistration = Array.isArray(card?.group) && card.group.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          {isGroupRegistration ? 'My Group Tourist Card' : 'My Smart Tourist Card'}
        </h2>
        <p className="text-gray-600 mt-1">Your digital identity for safe travel in India</p>
      </div>

      <div className="card">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div><h3 className="text-3xl font-bold">Smart Tourist Card</h3></div>
            <div className="bg-white p-3 rounded-xl shadow-lg" id="card-qr-code">
              <QRCodeReact value={verificationUrl} size={100} level="H" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="h-24 w-24 bg-white rounded-xl flex items-center justify-center text-6xl shadow-lg self-center md:self-start">👤</div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold">
                {name} {isGroupRegistration && <span className="text-base font-normal">(Group Leader)</span>}
              </h4>
              <div className="space-y-1 mt-2">
                <p><span className="font-semibold">ID:</span> <span className="font-mono">{touristId}</span></p>
                <p><span className="font-semibold">Country:</span> {country || 'N/A'}</p>
                <p><span className="font-semibold">{idLabel}:</span> {idNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-4 mb-4 bg-danger-500">
            <p className="text-danger-100 text-xs mb-1 font-medium">EMERGENCY CONTACT</p>
            {(emName || emPhone) ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{emName || 'N/A'}</p>
                  <p className="text-danger-100 text-sm">{emRel || 'Relation: N/A'}</p>
                </div>
                <p className="font-mono font-bold text-xl">{emPhone || 'N/A'}</p>
              </div>
            ) : (
              <p className="text-danger-100">Not provided</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 bg-success-500 text-white px-4 py-3 rounded-lg font-bold shadow-lg">
            <CheckCircle className="h-6 w-6" /> VERIFIED - ACTIVE STATUS
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={downloadQR} className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-lg font-medium">
              <Download className="inline h-4 w-4 mr-2" />
              Download QR
            </button>
          </div>
        </div>
      </div>

      {isGroupRegistration && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary-600" />
            Group Members ({card.group.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">ID Proof</th>
                  <th className="p-3 font-semibold">Blood Group</th>
                </tr>
              </thead>
              <tbody>
                {card.group.map((member) => {
                  const mDomestic = (member.touristType || '').toLowerCase() === 'domestic';
                  const idProof = mDomestic
                    ? `Aadhaar: ${member.aadhaarNumber || 'N/A'}`
                    : `Passport: ${member.passportNumber || 'N/A'}`;
                  return (
                    <tr key={member.memberId} className="border-t">
                      <td className="p-3 font-medium">{member.fullName}</td>
                      <td className="p-3">{idProof}</td>
                      <td className="p-3">{member.bloodGroup || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTouristCard;