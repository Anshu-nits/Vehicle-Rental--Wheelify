import Bike from "../../Models/Bike.js";
import User from "../../Models/User.js";

const removeProvidedBike = async (req, res) => {
  try {
    // Get user ID from the request object
    const userId = req.user.id;

    // Get bike ID from the request body
    const { bikeId } = req.body;

    // Validate the input
    if (!bikeId) {
      return res.status(400).json({
        success: false,
        message: "Bike ID is required to remove the bike from rentable.",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the bike exists in the user's providedBikes array
    const isBikeProvided = user.providedBikes.includes(bikeId);

    if (!isBikeProvided) {
      return res.status(403).json({
        success: false,
        message: "This bike is not registered under your provided vehicles.",
      });
    }

    // Fetch the bike from the database
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found.",
      });
    }

    // Ensure the bike is marked as rentable
    if (bike.status !== "provided for rent") {
      return res.status(400).json({
        success: false,
        message: "This bike is not currently provided for rent.",
      });
    }

    // Update the bike's status and reset rental details
    bike.status = "not provided for rent";
    bike.rentAmount = null;
    bike.availableDateFrom = null;
    bike.availableDateTill = null;
    bike.availableTimeFrom = null;
    bike.availableTimeTill = null;
    bike.location = null;

    await bike.save();

    // Remove the bike from the user's providedBikes array
    user.providedBikes = user.providedBikes.filter(
      (id) => id.toString() !== bikeId
    );

    // Update the user's rental history
    user.rentalHistory.push({
      bike: bike._id,
      action: "not provided for rent",
      timestamp: new Date(),
    });

    await user.save();

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Bike successfully removed from rentable and all details reset.",
    });
  } catch (error) {
    // Handle any errors during the process
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to remove the bike.",
      error: error.message,
    });
  }
};

export default removeProvidedBike;
