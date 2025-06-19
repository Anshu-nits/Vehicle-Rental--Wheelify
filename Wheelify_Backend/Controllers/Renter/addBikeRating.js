import Bike from "../../Models/Bike.js";
import User from "../../Models/User.js";
import Booking from "../../Models/Booking.js";

export const addBikeRating = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Rating and review are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Find booking and populate bike
    const booking = await Booking.findOne({ bookingId }).populate('bike');
    if (!booking?.bike) {
      return res.status(404).json({
        success: false,
        message: "Booking or bike not found"
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const bike = booking.bike;

    // Check for existing rating
    const hasRated = bike.ratings?.some(r => 
      r.userId?.toString() === userId && 
      r.bookingId?.toString() === bookingId
    );

    if (hasRated) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this bike for this booking"
      });
    }

    // Add new rating
    const newRating = {
      userId,
      bookingId,
      username: user.name,
      rating: parseInt(rating),
      review: review.trim(),
      timestamp: new Date()
    };

    bike.ratings = bike.ratings || [];
    bike.ratings.push(newRating);
    await bike.save();

    res.status(201).json({
      success: true,
      message: "Rating added successfully",
      data: {
        rating: newRating,
        totalRatings: bike.ratings.length
      }
    });

  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};