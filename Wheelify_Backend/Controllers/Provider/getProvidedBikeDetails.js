import Bike from "../../Models/Bike.js";

const getAllProvidedBikeDetails = async (req, res) => {
  try {
    const providedBikes = await Bike.find({ status: "provided for rent" }).populate("Owner");

    res.status(200).json({
      success: true,
      message: "Provided bikes fetched successfully.",
      bikes: providedBikes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch provided bikes.",
      error: error.message,
    });
  }
};

export default getAllProvidedBikeDetails;
