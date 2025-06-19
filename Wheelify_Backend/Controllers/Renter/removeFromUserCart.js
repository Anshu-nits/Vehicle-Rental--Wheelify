import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";
import Booking from "../../Models/Booking.js";

const removeFromUserCart = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user?.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.renter.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only remove your own bookings.",
      });
    }

    // Remove booking from cart
    user.cart = user.cart.filter(
      cartItemId => cartItemId.toString() !== bookingId
    );

    // Restore bike status
    const bike = await Bike.findById(booking.bike);
    if (bike) {
      bike.status = "provided for rent";
      await bike.save();
    }

    // Delete booking and save user
    await Booking.findByIdAndDelete(bookingId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully.",
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart.",
      error: error.message,
    });
  }
};

export default removeFromUserCart;