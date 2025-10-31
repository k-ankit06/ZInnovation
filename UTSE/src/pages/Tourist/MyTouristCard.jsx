import { useEffect, useState } from 'react';
import { Download, QrCode, CheckCircle, Users, Plus, Trash2, Calendar } from 'lucide-react';
import QRCodeReact from 'qrcode.react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthContext';
import api from '../../lib/apiClient';
import { toast } from 'react-toastify';

const MyTouristCard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all tourist cards from backend
  const fetchCards = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/tourist/me');
      const cardsList = data?.data?.cards || [];
      setCards(cardsList);
      
      // Auto-select the most recent card if none selected
      if (cardsList.length > 0 && !selectedCard) {
        setSelectedCard(cardsList[0]);
      }
    } catch (e) {
      console.error('Failed to fetch cards:', e);
      toast.error('Failed to load tourist cards');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Delete a card
  const handleDeleteCard = async (touristId) => {
    if (!touristId) return;
    
    const confirm = window.confirm('Are you sure you want to delete this tourist card? This action cannot be undone.');
    if (!confirm) return;

    try {
      await api.delete(`/api/tourist/me/${encodeURIComponent(touristId)}`);
      
      // Remove from local state
      const updatedCards = cards.filter(c => c.touristId !== touristId);
      setCards(updatedCards);
      
      // If deleted card was selected, select another one
      if (selectedCard?.touristId === touristId) {
        setSelectedCard(updatedCards[0] || null);
      }
      
      // Update user registration status if no cards left
      if (updatedCards.length === 0) {
        updateUser({ ...user, isRegistered: false });
      }
      
      toast.success('Card deleted successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete card');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <p className="text-gray-600">Loading your cards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <QrCode className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tourist Cards Found</h2>
          <p className="text-gray-600 mb-6">You haven't created any tourist cards yet. Create your first card to get started!</p>
          <Link to="/tourist/registration" className="btn-primary">
            <Plus className="inline h-5 w-5 mr-2" />
            Create New Card
          </Link>
        </div>
      </div>
    );
  }

  const card = selectedCard;
  if (!card) return null;

  const touristType = (card?.touristType || '').toLowerCase();
  const isDomestic = touristType === 'domestic';
  const idLabel = isDomestic ? 'Aadhaar' : 'Passport';
  const idNumber = isDomestic
    ? card?.aadhaarNumber
    : card?.passportNumber;

  const country = card?.country || '';
  const name = card?.fullName || user?.name || '';
  const touristId = card?.touristId || user?.touristId;
  const verificationUrl = `${window.location.origin}/verify/${touristId}`;

  const emName = card?.emergencyContactName || '';
  const emPhone = card?.emergencyContactPhone || '';
  const emRel = card?.emergencyContactRelation || '';

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Tourist Cards</h2>
          <p className="text-gray-600 mt-1">Manage all your digital tourist cards ({cards.length} card{cards.length !== 1 ? 's' : ''})</p>
        </div>
        <Link to="/tourist/registration" className="btn-primary">
          <Plus className="inline h-5 w-5 mr-2" />
          Add New Card
        </Link>
      </div>

      {/* Cards List/Selector */}
      {cards.length > 1 && (
        <div className="card">
          <h3 className="font-bold text-lg mb-3">Your Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cards.map((c) => {
              const isSelected = selectedCard?.touristId === c.touristId;
              const cType = (c?.touristType || '').toLowerCase();
              const cIsDomestic = cType === 'domestic';
              const cIdNumber = cIsDomestic ? c.aadhaarNumber : c.passportNumber;
              
              return (
                <div
                  key={c.touristId}
                  onClick={() => setSelectedCard(c)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{c.fullName}</p>
                      <p className="text-sm text-gray-600 font-mono">{c.touristId}</p>
                      <p className="text-xs text-gray-500 mt-1">{cIsDomestic ? 'Aadhaar' : 'Passport'}: {cIdNumber || 'N/A'}</p>
                      {c.group && c.group.length > 0 && (
                        <p className="text-xs text-primary-600 mt-1 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {c.group.length} member{c.group.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    {isSelected && <CheckCircle className="h-5 w-5 text-primary-600" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Card Display */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">
            {isGroupRegistration ? 'Group Tourist Card' : 'Smart Tourist Card'}
          </h3>
          <button
            onClick={() => handleDeleteCard(card.touristId)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Card
          </button>
        </div>

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
                <p className="font-mono font-bold text-xl">{emPhone || card?.emergencyContact || 'N/A'}</p>
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
            <div className="flex-1"></div>
            <div className="text-white/80 text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Created: {new Date(card.createdAt).toLocaleDateString()}
            </div>
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