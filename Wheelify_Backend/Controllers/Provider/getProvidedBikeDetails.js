import Bike from "../../Models/Bike.js";

const getAllProvidedBikeDetails = async (req, res) => {
  try {
    const eligibleBikeIds = await Bike.find({
      status: { $regex: /^provided for rent$/i },
      $or: [
        { img: { $exists: true, $ne: "", $ne: null } },
        { img: { $regex: /^https?:\/\// } }
      ],
      rentAmount: { $exists: true, $ne: null, $gt: 0 }
    }).distinct("_id");

    let bikes = await Bike.find(
      { _id: { $in: eligibleBikeIds } },
      "img rentAmount location company model age"
    ).sort({ createdAt: -1 });

    if (bikes.length === 0) {
      const relaxedBikeIds = await Bike.find({
        status: { $regex: /provided.*rent/i }
      }).distinct("_id");

      bikes = await Bike.find(
        { _id: { $in: relaxedBikeIds } },
        "img rentAmount location company model age"
      ).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Bikes fetched using relaxed filters.",
        bikes,
        debug: "Used fallback relaxed status filter",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bikes fetched using strict filters.",
      bikes,
      debug: `Found ${bikes.length} eligible bikes`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bikes.",
      error: error.message,
    });
  }
};

export default getAllProvidedBikeDetails;