// Services.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext/AuthContext';
import RatingModal from './RatingModel.jsx';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get("https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-top-rating");

      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's existing rating
  const fetchUserRating = async () => {
    try {
      const { data } = await axios.get("https://vehicle-rental-wheelify-backend.onrender.com/api/v1/my-rating", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (data.success) {
        setExistingRating(data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Don't log anything — it's expected for new users
        setExistingRating(null);
      } else {
        console.error("Unexpected error fetching user rating:", error);
      }
    }
  };


  const handleRateUsClick = async () => {
    if (!isLoggedIn) {
      alert('Please login to rate our platform');
      return;
    }

    await fetchUserRating();
    setIsModalOpen(true);
  };

  const handleRatingSubmit = async (ratingData) => {
    try {
      const { data } = await axios.post("https://vehicle-rental-wheelify-backend.onrender.com/api/v1/rate-platform", ratingData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        alert(existingRating ? 'Rating updated successfully!' : 'Thank you for your rating!');
        fetchTestimonials(); // Refresh testimonials
        setExistingRating(null);
      } else {
        alert(data.message || 'Error submitting rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error.response?.data?.message || 'Error submitting rating');
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-[#f0f9f4]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-8 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 bg-[#f0f9f4]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
              <p className="text-gray-600">Join thousands of happy riders and bike owners</p>
            </div>
            <button
              onClick={handleRateUsClick}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.175 3.617a1 1 0 00.95.69h3.801c.969 0 1.371 1.24.588 1.81l-3.073 2.234a1 1 0 00-.364 1.118l1.175 3.617c.3.921-.755 1.688-1.538 1.118l-3.073-2.234a1 1 0 00-1.175 0l-3.073 2.234c-.783.57-1.838-.197-1.538-1.118l1.175-3.617a1 1 0 00-.364-1.118L2.535 9.044c-.783-.57-.38-1.81.588-1.81h3.801a1 1 0 00.95-.69l1.175-3.617z" />
              </svg>
              <span>Rate Us</span>
            </button>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to rate our platform!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((user, index) => (
                <div
                  key={user.id}
                  className="bg-white rounded-xl p-8 flex flex-col items-center space-y-4 transition-transform transform hover:scale-105 duration-300 shadow-[10px_0_15px_rgba(0,0,0,0.1),-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400 text-2xl">👤</span>
                  </div>

                  <div className="flex justify-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill={i < user.stars ? '#facc15' : '#e5e7eb'}
                        className="w-5 h-5"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.175 3.617a1 1 0 00.95.69h3.801c.969 0 1.371 1.24.588 1.81l-3.073 2.234a1 1 0 00-.364 1.118l1.175 3.617c.3.921-.755 1.688-1.538 1.118l-3.073-2.234a1 1 0 00-1.175 0l-3.073 2.234c-.783.57-1.838-.197-1.538-1.118l1.175-3.617a1 1 0 00-.364-1.118L2.535 9.044c-.783-.57-.38-1.81.588-1.81h3.801a1 1 0 00.95-.69l1.175-3.617z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-700 italic text-center">"{user.text}"</p>
                  <h4 className="font-bold text-gray-700">{user.name}</h4>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <RatingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setExistingRating(null);
        }}
        onSubmit={handleRatingSubmit}
        existingRating={existingRating}
      />
    </>
  );
};

export default Testimonials;