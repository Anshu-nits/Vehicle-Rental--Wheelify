import User from "../../Models/User.js";

const showAllRegisteredBikes = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Find the user by ID and populate the 'car' field with the vehicle details
    const user = await User.findById(userId).populate("registeredBikes");

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Respond with the list of vehicles
    res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully.",
      vehicles: user.registeredBikes,
    });
  } catch (error) {
    // Handle any errors that occur during the fetching process
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles.",
      error: error.message,
    });
  }
};

export default showAllRegisteredBikes;
