import Bike from "../../Models/Bike.js";
import User from "../../Models/User.js";

const createRatingAndReview = async (req, res) => {
  try {
    const { bikeId, rating, review } = req.body;
    const userId = req.user.id; // Get userId from authenticated user

    // Validate input
    if (!bikeId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Bike ID, rating, and review are required.",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Check if the bike exists
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found.",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Create rating and review object
    const ratingReview = {
      user: userId,
      rating,
      review,
    };

    // Add the rating and review to the bike's ratings array
    bike.ratings.push(ratingReview);
    await bike.save();

    return res.status(201).json({
      success: true,
      message: "Rating and review successfully added.",
      bike: bike,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add rating and review.",
      error: error.message,
    });
  }
};

export default createRatingAndReview;
