import Bike from "../../Models/Bike.js";

const getRegisteredBikes = async (req, res) => {
  try {
    const userId = req.user.id;

    const bikes = await Bike.find({ Owner: userId });

    res.status(200).json({
      success: true,
      data: bikes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bikes",
      error: error.message,
    });
  }
};

export default getRegisteredBikes;