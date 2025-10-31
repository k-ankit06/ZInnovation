// ...existing code...
import { useState } from 'react';
import { useAuth } from '../components/Auth/AuthContext';
import { User, Phone, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../lib/apiClient';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const isAuthority = user?.role === 'authority';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    emergencyContactName: isAuthority ? '' : (user?.emergencyContactName || ''),
    emergencyContactPhone: isAuthority ? '' : (user?.emergencyContactPhone || ''),
    designation: isAuthority ? (user?.designation || '') : '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        ...(isAuthority
          ? { designation: formData.designation }
          : {
              emergencyContactName: formData.emergencyContactName,
              emergencyContactPhone: formData.emergencyContactPhone
            })
      };

      const { data } = await api.patch('/api/users/me', payload);
      updateUser(data.data);

      setMessage('Profile updated successfully!');
      toast.success('Profile updated successfully!');
      setTimeout(() => {
        setMessage('');
        navigate(`/${user.role}/dashboard`);
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Profile</h2>
        <p className="text-sm text-gray-600 mt-1">Update personal details & emergency contact</p>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary-600" />
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Cannot be changed)</label>
              <input
                type="email"
                name="email"
                readOnly
                value={user?.email || ''}
                className="w-full border rounded-md px-3 py-2 bg-gray-50 cursor-not-allowed"
              />
            </div>

            {isAuthority && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  name="designation"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>

        {!isAuthority && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-danger-600" />
              Emergency Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                <input type="text" name="emergencyContactName" className="w-full border rounded-md px-3 py-2" value={formData.emergencyContactName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input type="tel" name="emergencyContactPhone" className="w-full border rounded-md px-3 py-2" value={formData.emergencyContactPhone} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md shadow"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
// ...existing code...