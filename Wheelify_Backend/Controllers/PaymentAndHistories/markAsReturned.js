import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";
import Booking from "../../Models/Booking.js";

const markAsReturned = async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required.",
    });
  }

  try {
    const booking = await Booking.findOne({ bookingId }).populate("renter bike");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const currentStatus = booking.status?.toLowerCase();
    if (currentStatus !== "picked up") {
      return res.status(400).json({
        success: false,
        message: `Cannot mark as returned. Current status: ${booking.status}`,
      });
    }

    // Update booking status and timestamp
    booking.status = "returned";
    booking.timestamps = booking.timestamps || {};
    booking.timestamps.returnedAt = new Date();
    await booking.save();

    // Update bike status
    const bike = booking.bike;
    if (bike) {
      bike.status = "provided for rent"; // Available again
      bike.Renter = null;
      await bike.save();
    }

    // Safely update user's history
    if (booking.renter && bike) {
      const user = await User.findById(booking.renter._id);

      if (user) {
        const historyEntry = user.history.find(entry =>
          entry.bike?.toString() === bike._id.toString() && !entry.returnedAt
        );

        if (historyEntry) {
          historyEntry.status = "returned";
          historyEntry.returnedAt = booking.timestamps.returnedAt;
          await user.save();
        } else {
          console.warn("No matching history entry found to update.");
        }
      }
    }

    return res.json({
      success: true,
      message: "Bike marked as returned successfully.",
      data: {
        bookingId: booking.bookingId,
        status: booking.status,
        returnedAt: booking.timestamps.returnedAt,
      },
    });

  } catch (err) {
    console.error("Return error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

export default markAsReturned;