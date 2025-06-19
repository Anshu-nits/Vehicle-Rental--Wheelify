import Booking from "../../Models/Booking.js";
import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // 1. Find the booking by bookingId and populate renter and bike
    const booking = await Booking.findOne({ bookingId }).populate("renter bike");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // 2. Check if the booking is cancellable
    if (booking.status !== "booked" && booking.status !== "rented") {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled at this stage",
      });
    }

    // 3. Update booking status and timestamp
    booking.status = "cancelled";
    booking.timestamps.cancelledAt = new Date();
    await booking.save();

    // 4. Update the bike status and remove renter
    const bike = booking.bike;
    bike.status = "provided for rent";
    bike.renter = null;
    await bike.save();

    // 5. Fetch renter and owner
    const renter = await User.findById(booking.renter._id);
    const owner = await User.findById(booking.owner);

    // === Safe check ===
    if (!renter) {
      return res.status(500).json({
        success: false,
        message: "Renter not found",
      });
    }

    // 6. Update or insert into renter's history
    const historyIndex = renter.history.findIndex((entry) =>
      entry.booking.toString() === booking._id.toString()
    );

    if (historyIndex !== -1) {
      // Update existing history entry
      renter.history[historyIndex].type = "cancellation";
      renter.history[historyIndex].amount = booking.rentAmount;
    } else {
      // Add new history entry
      renter.history.push({
        booking: booking._id,
        type: "cancellation",
        amount: booking.rentAmount,
      });
    }

    // 7. Refund to renter
    renter.userBalance += booking.rentAmount;
    
    // Add refund transaction to transaction history
    renter.transactionHistory.push({
      booking: booking._id,
      type: "credit",
      amount: booking.rentAmount,
      paymentStatus: "paid",
      timestamp: new Date(),
    });
    renter.refundHistory.push({
      booking: booking._id,
      type: "credit",
      amount: booking.rentAmount,
      paymentStatus: "paid",
      timestamp: new Date(),
    });

    await renter.save();

    // 8. Deduct from owner
    if (owner) {


      owner.userBalance -= booking.rentAmount;
      
      // Add debit transaction to owner's transaction history
      owner.transactionHistory.push({
        booking: booking._id,
        type: "debit",
        amount: booking.rentAmount,
        paymentStatus: "paid",
        timestamp: new Date(),
      });

      await owner.save();
    }

    // 9. Respond with success
    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: {
        bookingId: booking.bookingId,
        status: "cancelled",
        cancelledAt: booking.timestamps.cancelledAt,
      },
    });

  } catch (error) {
    console.error("❌ Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default cancelBooking;