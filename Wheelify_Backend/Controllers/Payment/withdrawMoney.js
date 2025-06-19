import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";
import Booking from "../../Models/Booking.js";
import { v4 as uuidv4 } from 'uuid';

const combineDateAndTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}:00.000Z`);
};

const withdrawMoney = async (req, res) => {
  try {
    const userId = req.user?.id;
    const amount = 100; // fixed withdrawal amount

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.userBalance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance to withdraw ₹100." });
    }

    // Dummy Bike and Owner IDs
    const dummyBikeId = "6651234567890abcdef12345";
    const dummyOwnerId = "665fedcba012345678901234";

    // Dates & Times
    const availableDateFrom = new Date();
    const availableDateTill = new Date();
    availableDateTill.setDate(availableDateFrom.getDate() + 1);

    const timeFrom = combineDateAndTime(availableDateFrom.toISOString().split("T")[0], "09:00");
    const timeTill = combineDateAndTime(availableDateTill.toISOString().split("T")[0], "18:00");

    // Create a dummy booking for the withdrawal event
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

    // Subtract from user's balance
    user.userBalance -= amount;

    // Add transaction entry (with booking ref)
    user.transactionHistory.push({
      booking: savedBooking._id,
      type: "debit",
      amount,
      paymentStatus: "paid",
      timestamp: new Date(),
    });
    user.withdrawalHistory.push({
      booking: savedBooking._id,
      type: "credit",
      amount,
      paymentStatus: "paid",
      timestamp: new Date(),
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "₹100 withdrawn successfully.",
      balance: user.userBalance,
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Withdraw Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to withdraw money.",
      error: error.message,
    });
  }
};

export default withdrawMoney;