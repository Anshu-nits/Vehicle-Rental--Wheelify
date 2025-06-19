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

    // {
    //   "bikeId":"684448fd628b7954353ec010",
    //   "rentAmount":"20",
    //   "availableTimeFrom":"12:30 PM", 
    //   "availableTimeTill":"06:45 PM", 
    //   "availableDateFrom":"2025-06-21", 
    //   "availableDateTill":"2025-06-25",
    //   "location":"Silchar"
    // }
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

    await user.save();

    res.status(201).json({ success: true, message: "Bike provided for rent!", bike });
  } catch (err) {
    console.error("Error in provideBike:", err);
    res.status(500).json({ success: false, message: "Failed to provide bike.", error: err.message });
  }
};

export default provideBike;