import User from "../../Models/User.js";
import Booking from "../../Models/Booking.js";
import Bike from "../../Models/Bike.js";

const addToHistory = async (req, res) => {
  const { bookingId } = req.body;
  const userId = req.user.id;

  if (!bookingId) {
    return res.status(400).json({ message: "bookingId is required." });
  }

  try {
    // Find the booking by _id
    const booking = await Booking.findOne({ bookingId }).populate(
      "bike renter"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Validate that this booking belongs to the current user
    if (booking.renter._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    if (booking.renter.userBalance < booking.rentAmount) {
      return res.status(400).json({ success: false, message: "Insufficient balance to withdraw ₹100." });
    }

    // Update booking status
    booking.status = "rented";
    booking.paymentStatus = "paid";
    booking.timestamps.paidAt = new Date();

    // Update bike status
    const bike = await Bike.findById(booking.bike._id);
    bike.status = "rented";

    // Move booking from cart to history
    const user = await User.findById(userId);
    user.cart = user.cart.filter(
      (id) => id.toString() !== booking._id.toString()
    );
    user.history.push({
      booking: booking._id,
      type: "debit",
      amount: booking.rentAmount,
    });

    await Promise.all([user.save(), bike.save(), booking.save()]);

    // ↓↓↓ START: New Features ↓↓↓

    // Deduct balance from renter and log transaction
    user.userBalance -= booking.rentAmount;
    user.transactionHistory.push({
      booking: booking._id,
      type: "debit",
      amount: booking.rentAmount,
      paymentStatus: "paid",
      timestamp: new Date(),
    });
    await user.save();

    // Credit amount to owner and log transaction
    const owner = await User.findById(booking.owner);
    if (owner) {
      owner.userBalance += booking.rentAmount;
      owner.transactionHistory.push({
        booking: booking._id,
        type: "credit",
        amount: booking.rentAmount,
        paymentStatus: "paid",
        timestamp: new Date(),
      });
      await owner.save();
    }

    // ↑↑↑ END: New Features ↑↑↑

    return res.status(200).json({
      message: "Booking successfully moved to history.",
      bookingId: booking.bookingId,
      status: booking.status,
    });
  } catch (err) {
    console.error("addToHistory error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default addToHistory;