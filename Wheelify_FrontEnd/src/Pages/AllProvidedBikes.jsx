import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext/AuthContext';
import { Link } from 'react-router-dom';

const AllProvidedBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await axios.get('https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-provided-bikes', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBikes(res.data.bikes || []);
        setDebugInfo(res.data.debug || '');
        setError('');
      } catch (err) {
        setError('Failed to fetch bikes');
        setBikes([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBikes();
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-600">Loading bikes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mt-10">
          <p className="text-xl font-semibold text-red-600 mb-2">Error</p>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (bikes.length === 0) {
    return (
      <div className="px-6 max-w-4xl mx-auto mt-10">
        <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <div className="text-6xl mb-4">🚲</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bikes Available</h2>
          <p className="text-gray-600 mb-4">There are currently no bikes available for rent.</p>
          {debugInfo && (
            <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
              Debug: {debugInfo}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 lg:px-20 max-w-7xl mx-auto mt-10 mb-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Available Bikes</h1>
        <p className="text-lg text-green-600 font-semibold">
          {bikes.length} bike{bikes.length !== 1 ? 's' : ''} ready for rent
        </p>
        {debugInfo && (
          <p className="text-sm text-gray-500 mt-2 bg-blue-50 p-2 rounded">
            {debugInfo}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bikes.map((bike) => (
          <div
            key={bike._id}
            className="bg-white border border-gray-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
          >
            {/* Bike Image */}
            <div className="relative h-48 bg-gray-100">
              {bike.img ? (
                <img
                  src={bike.img}
                  alt={`${bike.company || 'Unknown'} ${bike.model || 'Bike'}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="absolute inset-0 flex items-center justify-center bg-gray-100"
                style={{ display: bike.img ? 'none' : 'flex' }}
              >
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🚲</div>
                  <p className="text-sm">No Image</p>
                </div>
              </div>
            </div>

            {/* Bike Details */}
            <div className="p-5">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {bike.company && bike.model
                    ? `${bike.company} - ${bike.model}`
                    : bike.company || bike.model || 'Bike'}
                </h3>
                <p className="text-sm text-gray-500 italic">
                  {bike.location || 'Location not specified'}
                </p>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">Rent:</span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{bike.rentAmount || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Age:</span>
                  <span className="text-gray-800 font-medium">
                    {bike.age ? `${bike.age} year${bike.age > 1 ? 's' : ''}` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/bike/${bike._id}`}
                className="block w-full text-center py-2.5 px-3 text-sm bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
              >
                View Details & Rent
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProvidedBikes;