import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { User, Lock, MapPin, Mail, UserCircle } from 'lucide-react';


const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
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
    setError('');

    try {
      const response = await api.post('/api/user/signup', formData);
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
    <div className="mb-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
      <p className="text-gray-600 mt-2">Join our platform today</p>
    </div>
    
    {error && (
      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
        <p className="font-medium">Signup Failed</p>
        <p className="text-sm">{error}</p>
      </div>
    )}
    
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="name">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
            required
          />
        </div>
      </div>
      
      <div className="relative">
        <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your.email@example.com"
            required
          />
        </div>
      </div>
      
      <div className="relative">
        <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="address">
          Address
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <MapPin size={18} className="text-gray-400" />
          </div>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your full address"
            rows="3"
            required
          />
        </div>
      </div>
      
      <div className="relative">
        <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="role">
          Account Role
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserCircle size={18} className="text-gray-400" />
          </div>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          >
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
            <option value="system_administrator">System Administrator</option>
          </select>
        </div>
      </div>
      
      <div className="relative">
        <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-gray-400" />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Password must be 8-16 characters, include an uppercase letter and a special character (!@#$%^&*).
        </p>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium transition-colors disabled:bg-blue-300"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
    
    <div className="mt-8 text-center">
      <p className="text-gray-600">
        Already have an account?{' '}
        <button 
          className="text-blue-600 font-medium hover:text-blue-800"
          onClick={()=>navigate("/login")}
        >
            
          Log in
        </button>
      </p>
    </div>
  </div>
  );
};

export default SignupForm;