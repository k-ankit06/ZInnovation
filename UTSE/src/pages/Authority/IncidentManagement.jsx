import { useEffect, useState } from 'react';
import { FileText, Plus, Search, Eye, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/apiClient';
import { toast } from 'react-toastify';

const statusLabel = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'resolved': return 'Resolved';
    case 'assigned':
    case 'in-progress': return 'In Progress';
    case 'open':
    default: return 'Open';
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'Critical': return 'bg-danger-100 text-danger-700';
    case 'High': return 'bg-warning-100 text-warning-700';
    case 'Medium': return 'bg-yellow-100 text-yellow-700';
    case 'Low': return 'bg-success-100 text-success-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'resolved') return 'bg-success-100 text-success-700';
  if (s === 'assigned' || s === 'in-progress') return 'bg-warning-100 text-warning-700';
  return 'bg-primary-100 text-primary-700';
};

const toUI = (i) => ({
  _id: i._id,
  refId: i.refId || 'INC-—',
  type: i.type || '-',
  tourist: i.touristName || '-',
  location: i.locationText || (i.location ? `${i.location.lat},${i.location.lng}` : '-'),
  date: i.occurredAt ? new Date(i.occurredAt).toISOString().slice(0, 10) : '',
  time: i.occurredAt ? new Date(i.occurredAt).toTimeString().slice(0, 5) : '',
  severity: i.severity || 'Medium',
  status: statusLabel(i.status),
  description: i.description || '',
  responseTeam: i.responseTeam || '',
  officer: i.officer || ''
});

const toPayload = (form) => ({
  type: form.type,
  severity: form.severity,
  status: 'open', // default for new incidents
  touristName: form.tourist,
  locationText: form.location,
  occurredAt: form.date && form.time ? new Date(`${form.date}T${form.time}:00Z`) : undefined,
  description: form.description,
  responseTeam: form.responseTeam,
  officer: form.officer
});

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/incidents', { params: { limit: 100 } });
      const list = (data?.data || []).map(toUI);
      setIncidents(list);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load incidents';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncidents(); }, []);

  const openModal = (incident = null) => {
    setSelectedIncident(incident ? { ...incident } : null);
    setIsEditing(!!incident);
    setShowModal(true);
  };

  const handleAddNewIncident = async (formData) => {
    try {
      const payload = toPayload(formData);
      const { data } = await api.post('/api/incidents', payload);
      const created = toUI(data?.data || {});
      setIncidents(prev => [created, ...prev]);
      toast.success(`Incident ${created.refId || ''} created`);
      setShowModal(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create incident';
      toast.error(msg);
    }
  };

  const handleUpdateIncident = async (formData) => {
    try {
      if (!selectedIncident?._id) return;
      const payload = toPayload(formData);
      const { data } = await api.patch(`/api/incidents/${selectedIncident._id}`, payload);
      const updated = toUI(data?.data || {});
      setIncidents(prev => prev.map(i => (i._id === updated._id ? updated : i)));
      toast.success(`Incident ${updated.refId || ''} updated`);
      setShowModal(false);
      setSelectedIncident(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update incident';
      toast.error(msg);
    }
  };

  const handleDeleteIncident = async (incidentId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this incident record?')) return;
      await api.delete(`/api/incidents/${incidentId}`);
      setIncidents(prev => prev.filter(i => i._id !== incidentId));
      toast.success('Incident deleted');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete incident';
      toast.error(msg);
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (incident.refId || '').toLowerCase().includes(q) ||
      (incident.tourist || '').toLowerCase().includes(q) ||
      (incident.type || '').toLowerCase().includes(q);
    const matchesFilter = filterType === 'all' || incident.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Incident Management</h2>
          <p className="text-gray-600 mt-1">Comprehensive incident tracking and reporting system</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="inline h-5 w-5 mr-2" /> Report New Incident
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <p>Total Incidents</p>
          <p className="text-4xl font-bold mt-1">{incidents.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
          <p>Resolved</p>
          <p className="text-4xl font-bold mt-1">
            {incidents.filter(i => i.status === 'Resolved').length}
          </p>
        </div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <p>In Progress</p>
          <p className="text-4xl font-bold mt-1">
            {incidents.filter(i => i.status !== 'Resolved').length}
          </p>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <p>Open</p>
          <p className="text-4xl font-bold mt-1">
            {incidents.filter(i => i.status === 'Open').length}
          </p>
        </div>
      </div>

      <div className="card p-0">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Ref ID, Tourist, or Type..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">All Types</option>
            <option>Medical Emergency</option>
            <option>Theft</option>
            <option>Lost Tourist</option>
            <option>Language Barrier</option>
            <option>Accident</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Ref ID</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Tourist</th>
                <th className="text-left py-3 px-4 font-semibold">Location</th>
                <th className="text-left py-3 px-4 font-semibold">Date/Time</th>
                <th className="text-left py-3 px-4 font-semibold">Severity</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td className="py-4 px-4" colSpan={8}>Loading...</td></tr>
              )}
              {!loading && filteredIncidents.map((incident) => (
                <tr key={incident._id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-4 font-mono text-sm font-semibold text-primary-600">
                    {incident.refId}
                  </td>
                  <td className="py-4 px-4">{incident.type}</td>
                  <td className="py-4 px-4 font-medium">{incident.tourist}</td>
                  <td className="py-4 px-4">{incident.location}</td>
                  <td className="py-4 px-4">
                    <div>{incident.date}</div>
                    <div className="text-sm">{incident.time}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(incident)} className="p-2 text-primary-600 hover:bg-primary-50 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteIncident(incident._id)} className="p-2 text-danger-600 hover:bg-danger-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredIncidents.length === 0 && (
                <tr><td className="py-4 px-4 text-gray-500" colSpan={8}>No incidents found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <IncidentFormModal
            incident={selectedIncident}
            isEditing={isEditing}
            onClose={() => setShowModal(false)}
            onSave={isEditing ? handleUpdateIncident : handleAddNewIncident}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const IncidentFormModal = ({ incident, isEditing, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    incident ? {
      type: incident.type || 'Medical Emergency',
      severity: incident.severity || 'Medium',
      tourist: incident.tourist || '',
      location: incident.location || '',
      date: incident.date || new Date().toISOString().split('T')[0],
      time: incident.time || new Date().toTimeString().slice(0,5),
      description: incident.description || '',
      responseTeam: incident.responseTeam || 'Medical Team Alpha',
      officer: incident.officer || ''
    } : {
      type: 'Medical Emergency',
      severity: 'Medium',
      tourist: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      description: '',
      responseTeam: 'Medical Team Alpha',
      officer: ''
    }
  );

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">{isEditing ? `Edit Incident: ${incident?.refId || ''}` : 'Report New Incident'}</h3>
            <button onClick={onClose} className="text-gray-500 text-2xl">×</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold">Incident Type *</label>
                <select name="type" className="input-field" value={formData.type} onChange={handleChange}>
                  <option>Medical Emergency</option>
                  <option>Theft</option>
                  <option>Lost Tourist</option>
                  <option>Language Barrier</option>
                  <option>Accident</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold">Severity Level *</label>
                <select name="severity" className="input-field" value={formData.severity} onChange={handleChange}>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold">Tourist Name *</label>
                <input name="tourist" type="text" className="input-field" value={formData.tourist} onChange={handleChange} required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold">Location *</label>
                <input name="location" type="text" className="input-field" value={formData.location} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-semibold">Date *</label>
                <input name="date" type="date" className="input-field" value={formData.date} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-semibold">Time *</label>
                <input name="time" type="time" className="input-field" value={formData.time} onChange={handleChange} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold">Description *</label>
                <textarea name="description" className="input-field" rows="3" value={formData.description} onChange={handleChange}></textarea>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 btn-primary">{isEditing ? 'Save Changes' : 'Submit Report'}</button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IncidentManagement;