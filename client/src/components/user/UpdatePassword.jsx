import { useState } from 'react';
import api from '../../utils/api';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await api.put(
        '/api/user/update_password', 
        formData
      );

      if (response.status === 200) {
        setMessage({ text: 'Password updated successfully', type: 'success' });
        setFormData({ oldPassword: '', newPassword: '' });
      }
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'An error occurred while updating password', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Password</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="oldPassword">
            Current Password
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="newPassword">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Password must be 8-16 characters, include an uppercase letter and a special character (!@#$%^&*).
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;