import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

interface Account {
  _id?: string;
  customer_id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Account>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    fetchAccounts();
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/test`);
      console.log('Server test response:', response.data);
      setServerStatus('connected');
      return true;
    } catch (error) {
      console.error('Server test failed:', error);
      setServerStatus('disconnected');
      return false;
    }
  };

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching accounts from:', `${API_BASE_URL}/accounts`);
      
      // First try to check if server is running
      try {
        const healthCheck = await axios.get(`${API_BASE_URL}/debug/customers`);
        console.log('Server health check:', healthCheck.status);
      } catch (healthError) {
        console.log('Health check failed:', healthError);
        throw new Error('Server is not running or not accessible');
      }
      
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      console.log('Accounts response:', response.data);
      
      if (response.data.success) {
        setAccounts(response.data.accounts);
      } else {
        throw new Error(response.data.message || 'Failed to load accounts');
      }
    } catch (error: any) {
      console.error('Fetch accounts error:', error);
      
      let errorMessage = 'Failed to load accounts: ';
      if (error.code === 'ERR_NETWORK') {
        errorMessage += 'Cannot connect to server. Please make sure the server is running on port 3001.';
      } else if (error.response) {
        errorMessage += `Server responded with ${error.response.status} - ${error.response.data?.message || error.message}`;
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      
      // Try to load mock data for testing
      setAccounts([
        {
          _id: 'mock1',
          customer_id: 1,
          username: 'testuser1',
          email: 'test1@example.com',
          first_name: 'Test',
          last_name: 'User 1',
          phone: '123-456-7890',
          address: '123 Test St'
        },
        {
          _id: 'mock2', 
          customer_id: 2,
          username: 'testuser2',
          email: 'test2@example.com',
          first_name: 'Test',
          last_name: 'User 2',
          phone: '098-765-4321',
          address: '456 Mock Ave'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setFormData({
      username: account.username,
      email: account.email,
      first_name: account.first_name,
      last_name: account.last_name,
      phone: account.phone || '',
      address: account.address || ''
    });
    setEditMode(true);
  };

  const handleUpdate = async () => {
    if (!selectedAccount) return;

    try {
      const accountId = selectedAccount._id || selectedAccount.customer_id;
      const response = await axios.put(`${API_BASE_URL}/accounts/${accountId}`, formData);
      
      if (response.data.success) {
        setMessage('Account updated successfully!');
        setEditMode(false);
        setSelectedAccount(null);
        fetchAccounts();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setError('Failed to update account: ' + error.response?.data?.message || error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (account: Account) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete account: ${account.username} (${account.email})?`
    );

    if (confirmDelete) {
      try {
        const accountId = account._id || account.customer_id;
        const response = await axios.delete(`${API_BASE_URL}/accounts/${accountId}`);
        
        if (response.data.success) {
          setMessage('Account deleted successfully!');
          fetchAccounts();
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (error: any) {
        setError('Failed to delete account: ' + error.response?.data?.message || error.message);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedAccount) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const accountId = selectedAccount._id || selectedAccount.customer_id;
      const response = await axios.put(`${API_BASE_URL}/accounts/${accountId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        setMessage('Password updated successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setError('Failed to update password: ' + error.response?.data?.message || error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const openPasswordModal = (account: Account) => {
    setSelectedAccount(account);
    setShowPasswordModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Account Management</h1>
          <div className="flex items-center gap-4">
            {/* Server Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                serverStatus === 'connected' ? 'bg-green-500' : 
                serverStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm">
                {serverStatus === 'connected' ? 'Server Connected' : 
                 serverStatus === 'disconnected' ? 'Server Disconnected' : 'Checking...'}
              </span>
            </div>
            {/* Refresh Button */}
            <button
              onClick={() => {
                fetchAccounts();
                checkServerStatus();
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Debug Info */}
        {serverStatus === 'disconnected' && (
          <div className="bg-yellow-600 text-white p-4 rounded mb-4">
            <h3 className="font-bold mb-2">Server Connection Issue</h3>
            <p>Cannot connect to server at {API_BASE_URL}</p>
            <p>Please make sure:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Server is running on port 3001</li>
              <li>Run: <code className="bg-black px-2 py-1 rounded">node simple-server.js</code></li>
              <li>Check console for server logs</li>
            </ul>
            <p className="mt-2 text-sm">Showing mock data for testing...</p>
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className="bg-green-600 text-white p-4 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Edit Mode */}
        {editMode && selectedAccount && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Edit Account: {selectedAccount.username}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Update Account
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setSelectedAccount(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Accounts List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account._id || account.customer_id} className="border-b border-gray-700">
                    <td className="px-4 py-3">{account.customer_id || account._id}</td>
                    <td className="px-4 py-3">{account.username}</td>
                    <td className="px-4 py-3">{account.email}</td>
                    <td className="px-4 py-3">{account.first_name} {account.last_name}</td>
                    <td className="px-4 py-3">{account.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(account)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openPasswordModal(account)}
                          className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                        >
                          Password
                        </button>
                        <button
                          onClick={() => handleDelete(account)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Password Modal */}
        {showPasswordModal && selectedAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">Change Password for {selectedAccount.username}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handlePasswordChange}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;