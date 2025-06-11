import Bike from "../../Models/Bike.js";

const getBikeDetails = async (req, res) => {
    try {
      const { bikeId } = req.body; // Extract bike ID from the request body
  
      // Fetch the bike details by ID
      const bikeDetails = await Bike.findById(bikeId)
        .populate("Owner", "name email contactNumber gender") // Populate Owner details (name and email)
        .populate("ratings.user", "name email contactNumber gender"); // Populate user in ratings array
  
      // Check if the bike exists
      if (!bikeDetails) {
        return res.status(404).json({
          success: false,
          message: "Bike not found with the given ID.",
        });
      }
  
      // Respond with the bike details
      res.status(200).json({
        success: true,
        message: "Bike details fetched successfully.",
        bike: bikeDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bike details.",
        error: error.message,
      });
    }
  };
  
export default getBikeDetails;
