import { useState, useEffect } from 'react'
import { Search, MapPin, Phone, Mail, Calendar, Globe, Eye, Users, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const TouristMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTourist, setSelectedTourist] = useState(null)
  const [tourists, setTourists] = useState([])

  const handleDeleteTourist = (touristToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${touristToDelete.fullName}?`);
    if (!confirmDelete) return;

    const storedData = localStorage.getItem('allTourists');
    const allTouristGroups = storedData ? JSON.parse(storedData) : [];

    let updatedGroups;
    if (touristToDelete.isGroupLeader) {
      // If deleting a group leader, remove the entire group
      updatedGroups = allTouristGroups.filter(group => group.touristId !== touristToDelete.touristId);
    } else {
      // If deleting a member, remove them from their group
      updatedGroups = allTouristGroups.map(group => {
        if (group.touristId === touristToDelete.leaderId) {
          return {
            ...group,
            group: group.group.filter(member => member.memberId !== touristToDelete.memberId)
          };
        }
        return group;
      });
    }

    localStorage.setItem('allTourists', JSON.stringify(updatedGroups));

    // Update the state to remove the tourist and their group members if they're a leader
    setTourists(prevTourists => 
      prevTourists.filter(t => {
        if (touristToDelete.isGroupLeader) {
          return t.touristId !== touristToDelete.touristId && t.leaderId !== touristToDelete.touristId;
        } else {
          return t.memberId !== touristToDelete.memberId;
        }
      })
    );
  };

  const handleSendAlert = (tourist) => {
    const confirmAlert = window.confirm(`Send safety alert to ${tourist.fullName}?\n\nThis will mark them as UNSAFE and notify them immediately.`);
    if (!confirmAlert) return;

    // Update tourist status to 'warning' (unsafe)
    setTourists(prevTourists =>
      prevTourists.map(t => {
        const isSameTourist = t.isGroupLeader 
          ? t.touristId === tourist.touristId 
          : t.memberId === tourist.memberId;
        
        if (isSameTourist) {
          return { ...t, status: 'warning' };
        }
        return t;
      })
    );

    // Update selectedTourist if it's the same one
    if (selectedTourist) {
      setSelectedTourist({ ...selectedTourist, status: 'warning' });
    }

    // Show success message
    alert(`Alert sent successfully to ${tourist.fullName}!\n\nStatus updated: UNSAFE\nNotification sent via: Email & SMS`);
  };

  useEffect(() => {
    const storedData = localStorage.getItem('allTourists');
    const allTouristGroups = storedData ? JSON.parse(storedData) : [];
    
    let flatTouristList = [];
    allTouristGroups.forEach(group => {
      if (!group.group) {
        group.group = [];
      }
      
      flatTouristList.push({
        ...group,
        isGroupLeader: true,
        groupSize: group.group.length
      });
      
      if (group.group.length > 0) {
        group.group.forEach(member => {
          flatTouristList.push({
            ...member,
            isGroupLeader: false,
            leaderId: group.touristId,
            leaderName: group.fullName,
          });
        });
      }
    });

    setTourists(flatTouristList.map(t => ({
      ...t,
      status: 'safe',
      safetyScore: Math.floor(Math.random() * 31) + 70,
      currentLocation: 'Taj Mahal, Agra'
    })));
  }, []);

  const filteredTourists = tourists.filter(tourist => {
    const searchLower = searchTerm.toLowerCase();
    
    const nameMatch = tourist.fullName && tourist.fullName.toLowerCase().includes(searchLower);
    const idMatch = (tourist.passportNumber && tourist.passportNumber.toLowerCase().includes(searchLower)) || 
                    (tourist.aadhaarNumber && tourist.aadhaarNumber.toLowerCase().includes(searchLower));
    const countryMatch = tourist.country && tourist.country.toLowerCase().includes(searchLower);
    
    const matchesSearch = nameMatch || idMatch || countryMatch;
    const matchesFilter = filterStatus === 'all' || tourist.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Tourist Monitoring</h2>
        <p className="text-gray-600 mt-1">Real-time tracking of all registered tourists and group members</p>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search by name, passport, or country..." className="input-field pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All ({tourists.length})</button>
            <button onClick={() => setFilterStatus('safe')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'safe' ? 'bg-success-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Safe</button>
            <button onClick={() => setFilterStatus('warning')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'warning' ? 'bg-warning-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Warning</button>
          </div>
        </div>
      </div>

      <motion.div className="grid grid-cols-1 gap-4" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
        {filteredTourists.map((tourist) => (
          <motion.div key={tourist.touristId || tourist.memberId} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${tourist.status === 'safe' ? 'bg-success-500' : 'bg-warning-500'}`}>
                    {tourist.fullName ? tourist.fullName.charAt(0) : '?'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {tourist.fullName || 'Unnamed Tourist'}
                      {tourist.isGroupLeader && tourist.groupSize > 0 && 
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full flex items-center gap-1"><Users size={12}/> Group Leader</span>
                      }
                      {!tourist.isGroupLeader && 
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Member</span>
                      }
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" /><span>{tourist.country || 'N/A'}</span><span className="mx-2">•</span><span>ID: {tourist.passportNumber || tourist.aadhaarNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary-600" /><div><p className="text-gray-500">Location</p><p className="font-medium">{tourist.currentLocation}</p></div></div>
                    <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-primary-600" /><div><p className="text-gray-500">Phone</p><p className="font-medium">{tourist.phone || 'N/A'}</p></div></div>
                    <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-primary-600" /><div><p className="text-gray-500">Email</p><p className="font-medium">{tourist.email || 'N/A'}</p></div></div>
                    <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-primary-600" /><div><p className="text-gray-500">Check-in</p><p className="font-medium">{tourist.checkInDate || 'N/A'}</p></div></div>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${tourist.status === 'safe' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}`}>{tourist.status === 'safe' ? '✓ Safe' : '⚠ Warning'}</span>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSelectedTourist(tourist)} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium"><Eye className="h-4 w-4 inline mr-1" />Details</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDeleteTourist(tourist)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"><Trash2 className="h-4 w-4 inline mr-1" />Delete</motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {selectedTourist && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Tourist Details</h3>
                <button onClick={() => setSelectedTourist(null)} className="text-gray-500 text-2xl">×</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-3xl ${selectedTourist.status === 'safe' ? 'bg-success-500' : 'bg-warning-500'}`}>{selectedTourist.fullName ? selectedTourist.fullName.charAt(0) : '?'}</div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedTourist.fullName || 'N/A'}</h4>
                    <p className="text-gray-600">{selectedTourist.country || 'N/A'}</p>
                  </div>
                </div>
                {!selectedTourist.isGroupLeader && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                        <p className="text-sm font-semibold text-blue-800">Part of a group led by: {selectedTourist.leaderName}</p>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="border-l-4 border-primary-500 pl-3"><p className="text-sm text-gray-500">ID Number</p><p className="font-semibold">{selectedTourist.passportNumber || selectedTourist.aadhaarNumber || 'N/A'}</p></div>
                    <div className="border-l-4 border-primary-500 pl-3"><p className="text-sm text-gray-500">Phone</p><p className="font-semibold">{selectedTourist.phone || 'N/A'}</p></div>
                    <div className="border-l-4 border-primary-500 pl-3"><p className="text-sm text-gray-500">Email</p><p className="font-semibold">{selectedTourist.email || 'N/A'}</p></div>
                    <div className="border-l-4 border-primary-500 pl-3"><p className="text-sm text-gray-500">Emergency Contact</p><p className="font-semibold">{selectedTourist.emergencyContactPhone || 'N/A'}</p></div>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={() => handleSendAlert(selectedTourist)} className="flex-1 btn-primary hover:bg-primary-700 transition-colors">Send Alert</button>
                  <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">View History</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TouristMonitoring;