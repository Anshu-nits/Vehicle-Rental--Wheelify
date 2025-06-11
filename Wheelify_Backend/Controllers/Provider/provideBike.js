import mongoose from "mongoose";
import Bike from "../../Models/Bike.js";
import User from "../../Models/User.js";

// Helper to convert "hh:mm AM/PM" to "HH:mm:ss"
const convertTo24Hour = (timeStr) => {
  const [time, modifier] = timeStr.trim().split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
};

const provideBike = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      bikeId,
      rentAmount,
      availableTimeFrom, // format: "12:30 PM"
      availableTimeTill, // format: "06:45 PM"
      availableDateFrom, // format: "2025-06-21"
      availableDateTill, // format: "2025-06-25"
      location,
    } = req.body;

    // Validate required fields
    if (!bikeId || !rentAmount || !availableTimeFrom ||
        !availableTimeTill || !availableDateFrom ||
        !availableDateTill || !location) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const user = await User.findById(userId).populate("registeredBikes");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const ownsBike = user.registeredBikes.some(b => b._id.toString() === bikeId);
    if (!ownsBike) return res.status(403).json({ success: false, message: "You don't own this bike." });

    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ success: false, message: "Bike not found." });
    if (bike.status === "provided for rent") return res.status(400).json({ success: false, message: "Bike already provided for rent." });

    // Convert dates
    const fromDate = new Date(availableDateFrom);
    const tillDate = new Date(availableDateTill);

    // Convert AM/PM times to 24-hour and attach to date
    const timeFromString = `${availableDateFrom}T${convertTo24Hour(availableTimeFrom)}`;
    const timeTillString = `${availableDateTill}T${convertTo24Hour(availableTimeTill)}`;

    const timeFrom = new Date(timeFromString);
    const timeTill = new Date(timeTillString);

    // Update bike
    bike.rentAmount = Number(rentAmount);
    bike.availableDateFrom = fromDate;
    bike.availableDateTill = tillDate;
    bike.availableTimeFrom = timeFrom;
    bike.availableTimeTill = timeTill;
    bike.location = location;
    bike.status = "provided for rent";
    await bike.save();

    // Update user
    user.providedBikes = user.providedBikes || [];
    if (!user.providedBikes.includes(bike._id)) user.providedBikes.push(bike._id);
    user.rentalHistory.push({ bike: bike._id, action: "provided for rent", timestamp: new Date() });
    await user.save();

    res.status(201).json({ success: true, message: "Bike provided for rent!", bike });
  } catch (err) {
    console.error("Error in provideBike:", err);
    res.status(500).json({ success: false, message: "Failed to provide bike.", error: err.message });
  }
};

export default provideBike;


// import mongoose from "mongoose";
// import Bike from "../../Models/Bike.js";
// import User from "../../Models/User.js";

// const provideBike = async (req, res) => {
//     /*
  //  "bikeId": "679483db8d9e214889a30c43",
  //  "rentAmount":"20",
  //  "availableTimeFrom":"12",
  //  "availableTimeTill":"18",
  //  "availableDateFrom":"21",
  //  "availableDateTill":"25",
  //  "location":"silchar"
//     */
//   try {
//     // Get user ID from the request object
//     const userId = req.user.id;

//     // Get bikeId, rent details, availability, and location from the request body
//     const {
//       bikeId,
//       rentAmount,
//       availableTimeFrom,
//       availableTimeTill,
//       availableDateFrom,
//       availableDateTill,
//       location,
//     } = req.body;

//     // Validate the input
//     if (
//       !bikeId ||
//       !rentAmount ||
//       !availableTimeFrom ||
//       !availableTimeTill ||
//       !availableDateFrom ||
//       !availableDateTill ||
//       !location
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "All fields (bikeId, rentAmount, availability times/dates, and location) are required.",
//       });
//     }

//     // Convert bikeId to ObjectId
//     const bikeObjectId = new mongoose.Types.ObjectId(bikeId);

//     // Check if the user owns the bike
//     const user = await User.findById(userId).populate("registeredBikes");
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     const ownsBike = user.registeredBikes.some(
//       (bike) => bike._id.toString() === bikeId
//     );
//     if (!ownsBike) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You can only create rentable posts for your registered vehicles.",
//       });
//     }

//     // Find the bike and check its status
//     const bike = await Bike.findById(bikeObjectId);
//     if (!bike) {
//       return res.status(404).json({
//         success: false,
//         message: "Bike not found.",
//       });
//     }

//     // Check if the bike is already provided for rent
//     if (bike.status === "provided for rent") {
//       return res.status(400).json({
//         success: false,
//         message: "This bike is already provided for rent.",
//       });
//     }

//     // Add rental details and availability to the bike
//     bike.rentAmount = rentAmount;
//     bike.availableTimeFrom = availableTimeFrom;
//     bike.availableTimeTill = availableTimeTill;
//     bike.availableDateFrom = availableDateFrom;
//     bike.availableDateTill = availableDateTill;
//     bike.location = location;
//     bike.status = "provided for rent"; // Update the bike's status
//     await bike.save();

//     // Update the user's providedBikes array
//     if (!user.providedBikes.includes(bikeObjectId)) {
//       user.providedBikes.push(bikeObjectId);
//     }

//     // Add the bike to the user's rental history
//     user.rentalHistory.push({
//       bike: bikeObjectId,
//       action: "provided for rent",
//       timestamp: new Date(),
//     });

//     await user.save();

//     // Respond with success and updated bike details
//     res.status(201).json({
//       success: true,
//       message:
//         "Rentable post created successfully, bike status updated, and added to your rental history.",
//       bike,
//     });
//   } catch (error) {
//     // Handle any errors during the process
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create rentable post.",
//       error: error.message,
//     });
//   }
// };

// export default provideBike;
