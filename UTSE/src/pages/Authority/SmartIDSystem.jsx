// ...existing code...
import { useState, useEffect } from 'react';
import { CreditCard, QrCode, Search, CheckCircle, XCircle, RefreshCw, Trash2 } from 'lucide-react';
import QRCode from 'qrcode.react';
import { toast } from 'react-toastify';
import api from '../../lib/apiClient';

const SmartIDSystem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [touristCards, setTouristCards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      fetchCards(searchTerm);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    fetchCards('');
  }, []);

  // Listen for new card events (from registration component or other tabs)
  useEffect(() => {
    const handleStorage = (e) => {
      if (!e) return;
      // new card added in another tab
      if (e.key === 'newTouristCard' && e.newValue) {
        try {
          const card = JSON.parse(e.newValue);
          if (card?.id) {
            setTouristCards(prev => [card, ...prev]);
            setSelectedCard(card);
          }
        } catch { /* ignore */ }
      }

      // card removed in another tab
      if (e.key === 'removedTouristCard' && e.newValue) {
        const removedId = e.newValue;
        setTouristCards(prev => prev.filter(c => String(c.id) !== String(removedId)));
        setSelectedCard(prev => (prev?.id === removedId ? null : prev));
      }
    };

    const handleCustomNew = (e) => {
      const card = e?.detail;
      if (card?.id) {
        setTouristCards(prev => [card, ...prev]);
        setSelectedCard(card);
      }
    };

    const handleCustomRemoved = (e) => {
      const id = e?.detail?.id || e?.detail;
      if (id) {
        setTouristCards(prev => prev.filter(c => String(c.id) !== String(id)));
        setSelectedCard(prev => (prev?.id === id ? null : prev));
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('newTouristCard', handleCustomNew);
    window.addEventListener('removedTouristCard', handleCustomRemoved);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('newTouristCard', handleCustomNew);
      window.removeEventListener('removedTouristCard', handleCustomRemoved);
    };
  }, []);

  const fetchCards = async (q) => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/tourist/cards', { params: { search: q } });
      const list = data?.data || [];
      setTouristCards(list);
    } catch (e) {
      // Fallback to old localStorage (legacy) if backend temporarily fails
      try {
        const allTourists = JSON.parse(localStorage.getItem('allTourists') || '[]');
        const legacy = allTourists.map(t => ({
          id: t.touristId,
          name: t.fullName,
          country: t.country,
          passport: t.passportNumber,
          aadhaar: t.aadhaarNumber,
          touristType: t.touristType,
          phone: t.phone,
          email: t.email,
          emergencyContactName: t.emergencyContactName,
          emergencyContact: t.emergencyContactPhone,
          checkIn: t.checkInDate,
          checkOut: t.checkOutDate,
          status: 'Active',
          verified: true
        }));
        setTouristCards(legacy);
      } catch {
        setTouristCards([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete / remove a tourist card
  const removeCard = async (id) => {
    if (!id) return;
    const confirm = window.confirm('Are you sure you want to remove this tourist card from the system? This action cannot be undone.');
    if (!confirm) return;

    try {
      // call server delete endpoint (adjust path if your server uses different route)
      await api.delete(`/api/tourist/cards/${encodeURIComponent(id)}`);

      // update local state
      setTouristCards(prev => prev.filter(c => String(c.id) !== String(id)));
      if (selectedCard?.id === id) setSelectedCard(null);

      // notify other tabs
      try { localStorage.setItem('removedTouristCard', String(id)); } catch (e) { /* ignore */ }
      window.dispatchEvent(new CustomEvent('removedTouristCard', { detail: { id } }));

      toast.success('Tourist card removed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove tourist card');
    }
  };

  const filteredCards = touristCards.filter(card => {
    const s = (searchTerm || '').toLowerCase();
    const nameMatch = String(card.name || '').toLowerCase().includes(s);
    const idMatch = String(card.id || '').toLowerCase().includes(s);
    const passportMatch = String(card.passport || '').toLowerCase().includes(s);
    const aadhaarMatch = String(card.aadhaar || '').toLowerCase().includes(s);
    const emailMatch = String(card.email || '').toLowerCase().includes(s);
    return nameMatch || idMatch || passportMatch || aadhaarMatch || emailMatch;
  });

  const verificationUrl = selectedCard ? `${window.location.origin}/verify/${selectedCard.id}` : '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Smart Tourist ID System</h2>
        <p className="text-gray-600 mt-1">Digital tourist cards for all registered travellers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <p>Total Cards Issued</p>
          <p className="text-4xl font-bold mt-1">{touristCards.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
          <p>Active Cards</p>
          <p className="text-4xl font-bold mt-1">{touristCards.filter(c => c.status === 'Active').length}</p>
        </div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <p>Pending Verification</p>
          <p className="text-4xl font-bold mt-1">{touristCards.filter(c => c.status !== 'Active').length}</p>
        </div>
        <div className="card bg-gradient-to-br from-danger-500 to-danger-600 text-white">
          <p>Verified (On-chain hash)</p>
          <p className="text-4xl font-bold mt-1">{touristCards.filter(c => c.verified).length}</p>
        </div>
      </div>

      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Tourist ID, Name, Passport/Aadhaar or Email..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => fetchCards(searchTerm)} title="Refresh" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <RefreshCw className="h-5 w-5" />
          </button>
          {loading && <div className="text-sm text-gray-500 mt-2">Loading...</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <div key={card.id} className="card border-2 border-gray-200 hover:border-primary-500 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-3xl text-white">👤</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{card.name}</h3>
                  <p className="text-sm text-gray-600">{card.country}</p>
                  <p className="text-xs text-gray-500 font-mono">{card.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {card.verified ? <CheckCircle className="h-6 w-6 text-success-500" /> : <XCircle className="h-6 w-6 text-warning-500" />}
                <button onClick={() => removeCard(card.id)} title="Remove card" className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{(card.touristType || '').toLowerCase() === 'domestic' ? 'Aadhaar:' : 'Passport:'}</span>
                <span className="font-semibold">{card.aadhaar || card.passport || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-semibold">{card.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${card.status === 'Active' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}`}>{card.status}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setSelectedCard(card)} className="flex-1 btn-primary">
                <QrCode className="inline h-4 w-4 mr-2" />
                View Digital Card
              </button>
              <button onClick={() => removeCard(card.id)} className="px-3 py-2 bg-red-600 text-white rounded ml-2 hidden sm:inline-block">
                Remove
              </button>
            </div>
          </div>
        ))}
        {!loading && filteredCards.length === 0 && (
          <p className="text-center text-gray-500 md:col-span-3">No registered tourists found.</p>
        )}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Smart Tourist ID Card</h3>
                <button onClick={() => setSelectedCard(null)} className="text-gray-500 text-2xl">×</button>
              </div>

              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white mb-6 shadow-2xl">
                <div className="flex items-start justify-between mb-6">
                  <div><h4 className="text-2xl font-bold">Digital Tourist Card</h4></div>
                  <CreditCard className="h-12 w-12 text-primary-200" />
                </div>
                <div className="flex gap-6 mb-6">
                  <div className="h-24 w-24 bg-white rounded-lg flex items-center justify-center text-6xl text-gray-700">👤</div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold mb-1">{selectedCard.name}</p>
                    <p className="text-primary-100 mb-1">{selectedCard.country}</p>
                    <p className="text-primary-200 text-sm font-mono">{selectedCard.id}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {selectedCard.verified && (
                        <span className="bg-success-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />Verified
                        </span>
                      )}
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">{selectedCard.status}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-primary-200 text-xs mb-1">{(selectedCard.touristType || '').toLowerCase() === 'domestic' ? 'Aadhaar Number' : 'Passport Number'}</p>
                    <p className="font-semibold">{selectedCard.aadhaar || selectedCard.passport || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-primary-200 text-xs mb-1">Phone</p>
                    <p className="font-semibold">{selectedCard.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-primary-200 text-xs mb-1">Check-in Date</p>
                    <p className="font-semibold">{selectedCard.checkIn || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-primary-200 text-xs mb-1">Check-out Date</p>
                    <p className="font-semibold">{selectedCard.checkOut || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-primary-100 text-xs mb-1">Emergency Contact</p>
                  <p className="font-semibold text-lg">
                    {selectedCard.emergencyContactName ? `${selectedCard.emergencyContactName} (${selectedCard.emergencyContact || 'N/A'})` : (selectedCard.emergencyContact || 'N/A')}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-lg mb-1">Digital QR Code</h5>
                    <p className="text-sm text-gray-600">Scan for instant verification</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <QRCode value={`${window.location.origin}/verify/${selectedCard.id}`} size={150} level="H" includeMargin={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartIDSystem;
// ...existing code...