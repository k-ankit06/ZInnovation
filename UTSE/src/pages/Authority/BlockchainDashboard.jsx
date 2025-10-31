import { useState, useEffect } from 'react';
import { Shield, Activity, CheckCircle, Database, Lock, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/apiClient';
import { toast } from 'react-toastify';

const BlockchainDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockchainStats();
  }, []);

  const fetchBlockchainStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/tourist/blockchain/stats');
      setStats(data?.data);
    } catch (err) {
      toast.error('Failed to load blockchain stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Loading blockchain data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card text-center">
        <p className="text-gray-600">Failed to load blockchain statistics</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary-600" />
          Blockchain Dashboard
        </h2>
        <p className="text-gray-600 mt-1">Real-time blockchain verification and security monitoring</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Blocks</p>
              <p className="text-4xl font-bold mt-1">{stats.totalBlocks}</p>
            </div>
            <Database className="h-12 w-12 text-purple-200" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Tourist Cards</p>
              <p className="text-4xl font-bold mt-1">{stats.totalTouristCards}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Chain Status</p>
              <p className="text-2xl font-bold mt-1">{stats.isValid ? '✅ VALID' : '⚠️ INVALID'}</p>
            </div>
            <Activity className="h-12 w-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Mining Difficulty</p>
              <p className="text-4xl font-bold mt-1">{stats.difficulty}</p>
            </div>
            <Lock className="h-12 w-12 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Latest Block Info */}
      {stats.latestBlock && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LinkIcon className="h-6 w-6 text-primary-600" />
            Latest Block Information
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Block Index</p>
                <p className="font-mono font-bold text-2xl text-primary-600">#{stats.latestBlock.index}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Timestamp</p>
                <p className="font-semibold">{new Date(stats.latestBlock.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Block Hash</p>
              <p className="font-mono text-sm bg-white p-3 rounded border border-gray-200 break-all">
                {stats.latestBlock.hash}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Previous Hash</p>
              <p className="font-mono text-sm bg-white p-3 rounded border border-gray-200 break-all">
                {stats.latestBlock.previousHash}
              </p>
            </div>

            {stats.latestBlock.data && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Block Data (Tourist Card)</p>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Tourist ID:</p>
                      <p className="font-semibold">{stats.latestBlock.data.touristId || 'Genesis Block'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Full Name:</p>
                      <p className="font-semibold">{stats.latestBlock.data.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Country:</p>
                      <p className="font-semibold">{stats.latestBlock.data.country || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Action:</p>
                      <p className="font-semibold text-success-600">{stats.latestBlock.data.action || 'GENESIS'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 mb-1">Nonce (Proof of Work)</p>
              <p className="font-mono font-bold text-lg">{stats.latestBlock.nonce}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Blockchain Security Features */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">🔐 Blockchain Security Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h4 className="font-bold text-green-800 mb-2">✅ Tamper-Proof Records</h4>
            <p className="text-sm text-green-700">Every tourist card is stored in an immutable blockchain. Any attempt to modify data will break the chain.</p>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-bold text-blue-800 mb-2">✅ Cryptographic Hashing</h4>
            <p className="text-sm text-blue-700">SHA-256 encryption ensures each block has a unique fingerprint that cannot be forged.</p>
          </div>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
            <h4 className="font-bold text-purple-800 mb-2">✅ Proof of Work</h4>
            <p className="text-sm text-purple-700">Mining difficulty ensures computational work is required to add blocks, preventing spam attacks.</p>
          </div>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
            <h4 className="font-bold text-orange-800 mb-2">✅ Chain Validation</h4>
            <p className="text-sm text-orange-700">Continuous validation ensures the entire blockchain integrity is maintained at all times.</p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button 
          onClick={fetchBlockchainStats}
          className="btn-primary"
        >
          🔄 Refresh Blockchain Data
        </button>
      </div>
    </motion.div>
  );
};

export default BlockchainDashboard;
