import Bike from "../../Models/Bike.js";
import User from "../../Models/User.js";

const unregisterBike = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get bike ID from the request body
    const { bikeId } = req.body;

    // Validate input
    if (!bikeId) {
      return res.status(400).json({
        success: false,
        message: "Bike ID is required to unregister a vehicle.",
      });
    }

    // Find the bike by ID and ensure it exists
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found.",
      });
    }

    // Check if the bike belongs to the current user
    if (bike.Owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to unregister this vehicle.",
      });
    }

    // Check if the bike is currently provided for rent
    if (bike.status === "provided for rent") {
      return res.status(400).json({
        success: false,
        message: "This bike is currently provided for rent and cannot be unregistered.",
      });
    }

    // Remove the bike from the User's registeredBikes list
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.registeredBikes = user.registeredBikes.filter(
      (id) => id.toString() !== bikeId
    );
    await user.save();

    // Delete the bike document from the database
    await Bike.findByIdAndDelete(bikeId);

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Vehicle unregistered successfully.",
    });
  } catch (error) {
    // Handle any errors during the process
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to unregister vehicle.",
      error: error.message,
    });
  }
};

export default unregisterBike;
