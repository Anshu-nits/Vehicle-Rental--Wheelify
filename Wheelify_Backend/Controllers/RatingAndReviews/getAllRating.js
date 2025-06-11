import Bike from "../../Models/Bike.js";

const getAllRatingsAndReviews = async (req, res) => {
  try {
    const { bikeId } = req.params;

    // Check if the bike exists
    const bike = await Bike.findById(bikeId).populate("ratings.user", "name email");
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found.",
      });
    }

    return res.status(200).json({
      success: true,
      ratingsAndReviews: bike.ratings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ratings and reviews.",
      error: error.message,
    });
  }
};

export default getAllRatingsAndReviews;
