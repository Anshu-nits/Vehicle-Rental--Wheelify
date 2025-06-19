import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";

const MyRegisteredBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [showRatingForm, setShowRatingForm] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRatedBikes, setUserRatedBikes] = useState(new Set()); // Track which bikes user has rated
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await axios.get("https://vehicle-rental-wheelify-backend.onrender.com/api/v1/my-bikes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBikes(res.data.data);
        
        // Initialize userRatedBikes based on existing ratings
        // Assuming you have user ID available in your AuthContext or can get it from token
        // For now, we'll track it based on successful submissions
        const ratedBikes = new Set();
        res.data.data.forEach(bike => {
          // If you have a way to check if current user has already rated this bike
          // you can add the logic here. For now, we'll rely on the submission tracking
        });
        setUserRatedBikes(ratedBikes);
      } catch (error) {
        console.error("Error fetching bikes:", error);
      }
    };

    fetchBikes();
  }, [token]);

  const handleRateNowClick = (bikeId) => {
    setShowRatingForm(bikeId);
    setRating(0);
    setReview("");
    setHoveredStar(0);
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoveredStar(starValue);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleSubmitRating = async (bikeId) => {
    if (rating === 0 || review.trim() === "") {
      alert("Please provide both rating and review");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `https://vehicle-rental-wheelify-backend.onrender.com/api/v1/add-bike-rating/${bikeId}`,
        {
          rating: rating,
          review: review.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local bikes state with the new rating
      setBikes((prevBikes) =>
        prevBikes.map((bike) =>
          bike._id === bikeId
            ? { ...bike, ratings: response.data.data.ratings }
            : bike
        )
      );

      // Mark this bike as rated by the current user
      setUserRatedBikes(prev => new Set([...prev, bikeId]));

      // Reset form and close modal
      setShowRatingForm(null);
      setRating(0);
      setReview("");
      alert("Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowRatingForm(null);
    setRating(0);
    setReview("");
    setHoveredStar(0);
  };

  const StarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
            className={`text-2xl transition-colors duration-200 ${
              star <= (hoveredStar || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            } hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}/5` : "Select rating"}
        </span>
      </div>
    );
  };

  const isUserRated = (bikeId) => {
    return userRatedBikes.has(bikeId);
  };

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4">My Registered Bikes</h2>
      {bikes.length === 0 ? (
        <p>You haven't registered any bikes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike) => (
            <div key={bike._id} className="border p-4 rounded-lg shadow-md">
              <img
                src={bike.img}
                alt={bike.model}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">
                {bike.company} - {bike.model}
              </h3>
              <p className="text-gray-600">Age: {bike.age} year(s)</p>
              
              <button
                onClick={() => !isUserRated(bike._id) && handleRateNowClick(bike._id)}
                disabled={isUserRated(bike._id)}
                className={`mt-3 px-4 py-2 rounded-md transition-colors duration-200 w-full font-medium ${
                  isUserRated(bike._id) 
                    ? "bg-green-500 text-white cursor-not-allowed opacity-75" 
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isUserRated(bike._id) ? "Thank You" : "Rate Now"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Rating Form Modal */}
      {showRatingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Rate This Bike</h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <StarRating />
              </div>

              {/* Review Text Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Give your review
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this bike..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSubmitRating(showRatingForm)}
                  disabled={isSubmitting || rating === 0 || review.trim() === ""}
                  className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
                    isSubmitting || rating === 0 || review.trim() === ""
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  onClick={handleCloseForm}
                  className="flex-1 py-2 px-4 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRegisteredBikes;