import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";
import Booking from "../../Models/Booking.js";
import { v4 as uuidv4 } from 'uuid';

// Utility to combine date and time into ISO Date
const combineDateAndTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}:00.000Z`);
};

const addToUserCart = async (req, res) => {
  try {
    const {
      bikeId,
      availableDateFrom,
      availableDateTill,
      availableTimeFrom,
      availableTimeTill,
      period = 1,
    } = req.body;

    const userId = req.user?.id;

    if (
      !bikeId ||
      !availableDateFrom ||
      !availableDateTill ||
      !availableTimeFrom ||
      !availableTimeTill
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking details are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({ success: false, message: "Bike not found." });
    }

    if (bike.status !== "provided for rent") {
      return res.status(400).json({
        success: false,
        message: `Bike is not available for rent. Current status: ${bike.status}`,
      });
    }

    if (bike.Owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot rent your own bike.",
      });
    }

    // Allow booking as long as bike is provided for rent (skip duplicate booking checks)

    const timeFrom = combineDateAndTime(availableDateFrom, availableTimeFrom);
    const timeTill = combineDateAndTime(availableDateTill, availableTimeTill);

    const newBooking = new Booking({
      bookingId: uuidv4(),
      bike: bike,
      renter: user._id,
      owner: bike.Owner,
      rentAmount: bike.rentAmount,
      period,
      availableTimeFrom: timeFrom,
      availableTimeTill: timeTill,
      availableDateFrom: new Date(availableDateFrom),
      availableDateTill: new Date(availableDateTill),
      location: bike.location,
      status: "booked",
      paymentStatus: "pending",
      timestamps: {
        bookedAt: new Date(),
      },
    });

    const savedBooking = await newBooking.save();

    // Add to user's cart
    user.cart.push(savedBooking._id);
    await user.save();

    // ✅ Now update bike status to 'in cart'
    bike.status = "in cart";
    await bike.save();

    return res.status(200).json({
      success: true,
      message: "Bike successfully added to cart.",
      booking: savedBooking,
      cartItemId: savedBooking._id,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding bike to cart.",
      error: error.message,
    });
  }
};

export default addToUserCart;