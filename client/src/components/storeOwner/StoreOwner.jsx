import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";
import api from "../../utils/api";

export const StoreOwner = () => {
  const { loginStatus } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loginStatus || loginStatus.role !== "store_owner") {
      navigate("/login");
    }
  }, [loginStatus, navigate]);

  useEffect(() => {
    const fetchStores = async () => {
      if (!loginStatus?.id) return;
      try {
        const res = await api.get(`/api/stores?store_owner_id=${loginStatus.id}`);
        console.log("Stores data:", res.data);
        
        setStores(res.data);
        if (res.data.length > 0) {
          setSelectedStoreId(res.data[0].id);
        }
      } catch (error) {
        console.error("Fetch stores error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to fetch stores");
      }
    };
    fetchStores();
  }, [loginStatus]);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!selectedStoreId) return;
      try {
        const res = await api.get(`/api/stores/${selectedStoreId}/ratings`);
        setRatings(res.data.ratings);
        console.log(res.data.ratings);
        
        setAverageRating(res.data.average);
        setError(null);
      } catch (error) {
        console.error("Fetch ratings error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to fetch ratings");
      }
    };
    fetchRatings();
  }, [selectedStoreId]);

  const handleStoreChange = (e) => {
    setSelectedStoreId(parseInt(e.target.value));
  };

  if (!loginStatus || loginStatus.role !== "store_owner") {
    return <div>Please log in as a store owner</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Store Owner Dashboard</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Your Stores</h2>
        {stores.length === 0 ? (
          <p className="text-gray-500">No stores found. Contact an admin to add a store.</p>
        ) : (
          <div className="mb-4">
            <label htmlFor="storeSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Select Store
            </label>
            <select
              id="storeSelect"
              value={selectedStoreId || ""}
              onChange={handleStoreChange}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      
      {selectedStoreId && (
        <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            Ratings for {stores.find(s => s.id === selectedStoreId)?.name}
          </h2>
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-700">
              Average Rating: 
              <span className="ml-2 text-yellow-500">
                {averageRating ? (
                  <>
                    ★{Number(parseFloat(averageRating).toFixed(2))}
                    
                  </>
                ) : (
                  "N/A"
                )}
              </span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ratings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No ratings found for this store.
                    </td>
                  </tr>
                ) : (
                  ratings.map((rating, ind)=>(
                    <tr key={ind} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ind+1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rating.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-yellow-500">★</span> {rating.rating}
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default StoreOwner;