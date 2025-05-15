import { useState, useEffect } from 'react';
import { Search, Star, Edit2, X } from 'lucide-react';
import api from '../../utils/api';

const StoreList = () => {
  
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch stores data from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/stores');
        setStores(response.data);
        setFilteredStores(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stores');
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);
  
  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStores(stores);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = stores.filter(
        store => 
          store.name.toLowerCase().includes(term) || 
          store.address.toLowerCase().includes(term)
      );
      setFilteredStores(filtered);
    }
  }, [searchTerm, stores]);
  
  // Handle rating submit/update
  const handleRatingSubmit = async () => {
    if (!selectedStore || ratingValue === 0) {
      setError('Please select a valid rating');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing && selectedStore.user_rating && selectedStore.user_rating.id) {
        // Update existing rating
        await api.put(`/api/ratings/${selectedStore.user_rating.id}`, { rating: ratingValue });

        const response = await api.get('/api/stores');
        setStores(response.data);
        setFilteredStores(response.data);
      } else { 
        // Submit new rating
        await api.post('/api/ratings', { 
          store_id: selectedStore.id, 
          rating: ratingValue 
        });
        
        // Refetch stores to get updated overall_rating
    const response = await api.get('/api/stores');
    setStores(response.data);
    setFilteredStores(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting rating');
    } finally {
      setLoading(false);
      closeRatingModal();
    }
  };
  
  
  const openRatingModal = (store, editing = false) => {
    setSelectedStore(store);
    setIsEditing(editing);
    setRatingValue(editing && store.user_rating && store.user_rating.rating ? store.user_rating.rating : 0);
    setRatingModalOpen(true);
    setError(null); 
  };
  
  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedStore(null);
    setRatingValue(0);
    setIsEditing(false);
  };
  

  const StarRating = ({ value, onChange, editable = false }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer ${
              star <= value
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } ${editable ? 'hover:text-yellow-400' : ''}`}
            onClick={() => editable && onChange(star)}
          />
        ))}
      </div>
    );
  };

  if (loading && stores.length === 0) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && stores.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Store Listings</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by store name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={20} />
          </div>
          {searchTerm && (
            <button 
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      
      {/* Store Listings */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No stores found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold mb-2 text-gray-800">{store.name}</h2>
              <p className="text-gray-600 mb-4">{store.address}</p>
              
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700 mr-2">Overall Rating:</span>
                <div className="flex items-center">
                  <Star className="text-yellow-400 fill-yellow-400 mr-1" size={16} />
                  <span className="font-bold">{store.overall_rating ? Number(store.overall_rating).toFixed(1) : 'No ratings yet'}</span>
                </div>
              </div>
              
              {store.user_rating && store.user_rating.rating ? (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                    <button 
                      onClick={() => openRatingModal(store, true)}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </button>
                  </div>
                  <StarRating value={store.user_rating.rating} onChange={() => {}} />
                </div>
              ) : (
                <div className="mb-4">
                  <button 
                    onClick={() => openRatingModal(store)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full transition-colors text-sm font-medium"
                  >
                    Rate This Store
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Rating Modal */}
      {ratingModalOpen && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Update Your Rating' : 'Rate This Store'}
              </h3>
              <button 
                onClick={closeRatingModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-1">{selectedStore.name}</h4>
              <p className="text-gray-600 text-sm">{selectedStore.address}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Rating
              </label>
              <div className="flex justify-center mb-2">
                <StarRating value={ratingValue} onChange={setRatingValue} editable={true} />
              </div>
              <div className="text-center text-gray-700">
                {ratingValue > 0 ? `You selected: ${ratingValue} ${ratingValue === 1 ? 'star' : 'stars'}` : 'Please select a rating'}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeRatingModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                disabled={ratingValue === 0 || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Submitting...' : isEditing ? 'Update Rating' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;