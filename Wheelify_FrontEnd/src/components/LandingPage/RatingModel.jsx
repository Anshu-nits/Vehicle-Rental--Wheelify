// Rating Model

import React, { useState, useEffect } from 'react';

const RatingModal = ({ isOpen, onClose, onSubmit, existingRating = null }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setReview(existingRating.review);
    } else {
      setRating(0);
      setReview('');
    }
  }, [existingRating, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !review.trim()) {
      alert('Please provide both rating and review');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, review });
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {existingRating ? 'Update Your Rating' : 'Rate Our Platform'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <svg
                    className="w-8 h-8 transition-colors duration-200"
                    fill={star <= (hoveredRating || rating) ? '#facc15' : '#e5e7eb'}
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.175 3.617a1 1 0 00.95.69h3.801c.969 0 1.371 1.24.588 1.81l-3.073 2.234a1 1 0 00-.364 1.118l1.175 3.617c.3.921-.755 1.688-1.538 1.118l-3.073-2.234a1 1 0 00-1.175 0l-3.073 2.234c-.783.57-1.838-.197-1.538-1.118l1.175-3.617a1 1 0 00-.364-1.118L2.535 9.044c-.783-.57-.38-1.81.588-1.81h3.801a1 1 0 00.95-.69l1.175-3.617z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Share your experience with our platform..."
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {review.length}/500 characters
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !review.trim()}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : existingRating ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;