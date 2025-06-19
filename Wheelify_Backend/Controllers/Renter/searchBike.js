import mongoose from "mongoose";
import Bike from "../../Models/Bike.js";

const searchAvailableBikes = async (req, res) => {
  try {
    const { desiredTimeFrom, desiredTimeTill, desiredDate, location } = req.body;

    if (!desiredTimeFrom || !desiredTimeTill || !desiredDate || !location) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const date = new Date(desiredDate);
    if (isNaN(date)) {
      return res.status(400).json({ success: false, message: "Invalid date format." });
    }

    const [fromHour, fromMin] = desiredTimeFrom.split(":").map(Number);
    const [tillHour, tillMin] = desiredTimeTill.split(":").map(Number);

    const timeFrom = new Date(date);
    timeFrom.setHours(fromHour, fromMin, 0, 0);

    const timeTill = new Date(date);
    timeTill.setHours(tillHour, tillMin, 0, 0);

    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(400).json({ success: false, message: "User ID is missing." });
    }

    const availableBikes = await Bike.find({
      status: "provided for rent",
      location,
      availableTimeFrom: { $lte: timeFrom },
      availableTimeTill: { $gte: timeTill },
      availableDateFrom: { $lte: date },
      availableDateTill: { $gte: date },
      Owner: { $ne: new mongoose.Types.ObjectId(currentUserId) },
    });

    // ❗ Do NOT return 404. Always return 200 with empty array
    return res.status(200).json({ success: true, bikes: availableBikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error", error: error.message });
  }
};

export default searchAvailableBikes;

