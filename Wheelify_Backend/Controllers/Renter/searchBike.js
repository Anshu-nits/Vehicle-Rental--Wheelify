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

    if (availableBikes.length === 0) {
      return res.status(404).json({ success: false, message: "No bikes found." });
    }

    res.json({ success: true, bikes: availableBikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error", error: error.message });
  }
};

export default searchAvailableBikes;


// import mongoose from "mongoose";
// import Bike from "../../Models/Bike.js";

// const searchAvailableBikes = async (req, res) => {
//   try {
//     const { desiredTimeFrom, desiredTimeTill, desiredDate, location } = req.body;

//     // Validate input
//     if (!desiredTimeFrom || !desiredTimeTill || !desiredDate || !location) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields (desiredTimeFrom, desiredTimeTill, desiredDate, and location) are required.",
//       });
//     }

//     // Parse input to appropriate types
//     const timeFrom = Number(desiredTimeFrom);
//     const timeTill = Number(desiredTimeTill);
//     const date = Number(desiredDate);

//     // Extract user ID from req.user
//     const currentUserId = req.user.id; // `id` comes from the decoded token
//     if (!currentUserId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is missing in the request.",
//       });
//     }

//     console.log("Current User ID:", currentUserId);

//     // Find bikes that match the criteria and are not owned by the current user
//     const availableBikes = await Bike.find({
//       status: "provided for rent",
//       location: location,
//       availableTimeFrom: { $lte: timeFrom },
//       availableTimeTill: { $gte: timeTill },
//       availableDateFrom: { $lte: date },
//       availableDateTill: { $gte: date },
//       Owner: { $ne: new mongoose.Types.ObjectId(currentUserId) }, // Ensure proper ObjectId format
//     });

//     // If no bikes are found, return a message
//     if (availableBikes.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No bikes available matching the specified criteria.",
//       });
//     }

//     // Respond with the list of available bikes
//     res.status(200).json({
//       success: true,
//       message: "Available bikes fetched successfully.",
//       bikes: availableBikes,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch available bikes.",
//       error: error.message,
//     });
//   }
// };

// export default searchAvailableBikes;
