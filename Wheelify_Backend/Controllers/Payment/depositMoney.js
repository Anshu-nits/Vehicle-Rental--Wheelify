import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";
import Booking from "../../Models/Booking.js";
import { v4 as uuidv4 } from 'uuid';

const combineDateAndTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}:00.000Z`);
};

const depositMoney = async (req, res) => {
  try {
    const userId = req.user?.id;
    const amount = 100; // can be dynamic

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Dummy Bike and Owner
    const dummyBikeId = "6651234567890abcdef12345";
    const dummyOwnerId = "665fedcba012345678901234";

    // Dates & Times
    const availableDateFrom = new Date();
    const availableDateTill = new Date();
    availableDateTill.setDate(availableDateFrom.getDate() + 1);

    const timeFrom = combineDateAndTime(availableDateFrom.toISOString().split("T")[0], "09:00");
    const timeTill = combineDateAndTime(availableDateTill.toISOString().split("T")[0], "18:00");

    // Create a dummy booking for the deposit event
    const newBooking = new Booking({
      bookingId: uuidv4(),
      bike: dummyBikeId,
      renter: userId,
      owner: dummyOwnerId,
      rentAmount: amount,
      period: 1,
      availableTimeFrom: timeFrom,
      availableTimeTill: timeTill,
      availableDateFrom,
      availableDateTill,
      location: "NIT Silchar",
      status: "booked",
      paymentStatus: "paid",
      timestamps: { bookedAt: new Date() },
    });

    const savedBooking = await newBooking.save();

    // Update user's balance and add to transactionHistory
    user.userBalance += amount;

    user.transactionHistory.push({
      booking: savedBooking._id,
      type: "credit",
      amount,
      paymentStatus: "paid",
      timestamp: new Date(),
    });
    user.depositHistory.push({
      booking: savedBooking._id,
      type: "credit",
      amount,
      paymentStatus: "paid",
      timestamp: new Date(),
    });


    await user.save();

    res.status(200).json({
      success: true,
      message: "Money deposited successfully.",
      balance: user.userBalance,
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Deposit Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deposit money.",
      error: error.message,
    });
  }
};

export default depositMoney;