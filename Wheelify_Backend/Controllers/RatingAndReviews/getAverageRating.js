import Bike from "../../Models/Bike.js";

const getAverageRating = async (req, res) => {
  try {
    const { bikeId } = req.params;

    // Check if the bike exists
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found.",
      });
    }

    // If the bike has no ratings, return 0 as the average rating
    if (bike.ratings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No ratings yet.",
        averageRating: 0,
      });
    }

    // Calculate the average rating
    const totalRating = bike.ratings.reduce((acc, ratingReview) => acc + ratingReview.rating, 0);
    const averageRating = totalRating / bike.ratings.length;

    return res.status(200).json({
      success: true,
      message: "Average rating fetched successfully.",
      averageRating: averageRating.toFixed(2), // Round to 2 decimal places
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch average rating.",
      error: error.message,
    });
  }
};

export default getAverageRating;
