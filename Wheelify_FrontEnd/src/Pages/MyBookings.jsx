import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import { Loader, Star, X } from "lucide-react";

const RentalHistory = () => {
  const { token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRatingItem, setCurrentRatingItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-rental-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setHistory(res.data.data);
    } catch (error) {
      console.error("Error fetching rental history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const handleAction = async (endpoint, bookingId, confirmMessage, successMessage) => {
    if (!window.confirm(confirmMessage)) return;

    setActionLoading(bookingId);
    try {
      const response = await axios.post(
        endpoint,
        { bookingId },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 
        }
      );

      if (response.data.success) {
        alert(successMessage);
        setTimeout(() => fetchHistory(), 500);
      } else {
        alert(response.data.message || "Operation failed.");
      }
    } catch (error) {
      const message = error.code === "ECONNABORTED" 
        ? "Request timed out. Please try again."
        : error.response?.data?.message || "Operation failed.";
      alert(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = (bookingId) => handleAction(
    "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/cancel-booking", 
    bookingId, 
    "Are you sure you want to cancel this booking?", 
    "Booking cancelled successfully!"
  );

  const handlePickup = (bookingId) => handleAction(
    "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/mark-pickedup", 
    bookingId, 
    "Mark this bike as picked up?", 
    "Bike marked as picked up successfully!"
  );

  const handleDrop = (bookingId) => handleAction(
    "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/mark-returned", 
    bookingId, 
    "Mark this bike as returned?", 
    "Bike marked as returned successfully!"
  );

  const handleRateNow = (item) => {
    setCurrentRatingItem(item);
    setShowRatingModal(true);
    setRating(0);
    setReview("");
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setCurrentRatingItem(null);
    setRating(0);
    setReview("");
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!review.trim()) {
      alert("Please write a review");
      return;
    }

    const bookingId = currentRatingItem.bookingId;
    if (!bookingId) {
      alert("Booking ID not found. Cannot submit rating.");
      return;
    }

    setRatingLoading(true);
    try {
      const response = await axios.post(
        `https://vehicle-rental-wheelify-backend.onrender.com/api/v1/add-bike-rating/${bookingId}`,
        { rating, review: review.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Rating submitted successfully!");
        closeRatingModal();
        fetchHistory(); // Refresh to update UI based on backend logic
      } else {
        alert(response.data.message || "Failed to submit rating.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit rating.");
    } finally {
      setRatingLoading(false);
    }
  };

  const renderStatusActions = (item) => {
    const status = item.status?.toLowerCase().trim();
    const itemId = item.bookingId || item._id;
    const isLoading = actionLoading === itemId;

    const buttonClass = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full flex items-center justify-center gap-2";
    const loadingIcon = isLoading ? <Loader className="animate-spin w-4 h-4" /> : null;

    if (status === "rented" || status === "onrent") {
      return (
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={() => handlePickup(itemId)}
            disabled={isLoading}
            className={`${buttonClass} bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white`}
          >
            {loadingIcon} Pick Up Now
          </button>
          <button
            onClick={() => handleCancel(itemId)}
            disabled={isLoading}
            className={`${buttonClass} bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white`}
          >
            {loadingIcon} Cancel Booking
          </button>
        </div>
      );
    }

    if (status === "picked up") {
      return (
        <button
          onClick={() => handleDrop(itemId)}
          disabled={isLoading}
          className={`${buttonClass} bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white`}
        >
          {loadingIcon} Drop Now
        </button>
      );
    }

    if (status === "returned") {
      return (
        <button
          onClick={() => handleRateNow(item)}
          className={`${buttonClass} bg-green-500 hover:bg-green-600 text-white`}
        >
          Rate Now
        </button>
      );
    }

    if (status === "cancelled") {
      return (
        <div className={`${buttonClass} bg-gray-400 text-white`}>
          Cancelled
        </div>
      );
    }

    return (
      <div className={`${buttonClass} bg-gray-200 text-gray-600`}>
        Status: {item.status}
      </div>
    );
  };

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase().trim();
    const configs = {
      cancelled: { border: "#EF4444", badge: "bg-red-100 text-red-800", text: "Cancelled" },
      returned: { border: "#10B981", badge: "bg-green-100 text-green-800", text: "Returned" },
      "picked up": { border: "#F59E0B", badge: "bg-yellow-100 text-yellow-800", text: "Picked Up" },
      rented: { border: "#3B82F6", badge: "bg-blue-100 text-blue-800", text: "Rented" },
      onrent: { border: "#3B82F6", badge: "bg-blue-100 text-blue-800", text: "Rented" },
    };
    return configs[s] || { border: "#6B7280", badge: "bg-gray-100 text-gray-800", text: status };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        <p className="text-lg">No rental history found.</p>
        <p className="text-sm mt-2">Your rental history will appear here once you make a booking.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rental History</h2>
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
        >
          {loading ? <Loader className="animate-spin w-4 h-4" /> : null} Refresh
        </button>
      </div>

      {history.map((item, index) => {
        const statusConfig = getStatusConfig(item.status);
        return (
          <div
            key={item.bookingId || item._id || index}
            className="bg-white shadow-md rounded-xl p-4 border-l-4 flex flex-col lg:flex-row lg:items-center gap-4"
            style={{ borderColor: statusConfig.border }}
          >
            <div className="flex-shrink-0">
              <img
                src={item.bikeImage || "/placeholder-bike.jpg"}
                alt="bike"
                className="w-28 h-20 rounded-lg object-cover border border-gray-200"
                onError={(e) => { e.target.src = "/placeholder-bike.jpg"; }}
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig.badge}`}>
                  {statusConfig.text}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Rental Period:</span> {item.start} → {item.end}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Pickup Location:</span> {item.pickup}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Owner:</span> {item.owner}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Duration:</span> {item.duration} |
                <span className="font-medium"> Rate:</span> {item.rate} |
                <span className="font-medium"> Total:</span> {item.total}
              </p>
              {item.refund && (
                <p className="text-sm text-green-600 font-medium">Refund: ₹{item.refund}</p>
              )}
              {item.bookingId && (
                <p className="text-xs text-gray-500">Booking ID: {item.bookingId}</p>
              )}
            </div>

            <div className="w-full lg:w-48 flex-shrink-0">
              {renderStatusActions(item)}
            </div>
          </div>
        );
      })}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Rate Your Experience</h3>
              <button onClick={closeRatingModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src={currentRatingItem?.bikeImage || "/placeholder-bike.jpg"}
                  alt="bike"
                  className="w-16 h-12 rounded-lg object-cover border border-gray-200"
                  onError={(e) => { e.target.src = "/placeholder-bike.jpg"; }}
                />
                <div>
                  <h4 className="font-medium text-gray-800">{currentRatingItem?.title}</h4>
                  <p className="text-sm text-gray-600">Owner: {currentRatingItem?.owner}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review *</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this bike..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={closeRatingModal}
                disabled={ratingLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                disabled={ratingLoading || rating === 0 || !review.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {ratingLoading ? <Loader className="animate-spin w-4 h-4" /> : null}
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalHistory;