import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";
import Booking from "../../Models/Booking.js";

const clearUserCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const bookingIds = user.cart;

    if (!bookingIds.length) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty.",
      });
    }

    // Get bookings in the cart
    const bookings = await Booking.find({ _id: { $in: bookingIds } });

    // Update each bike's status back to "provided for rent"
    const bikeUpdatePromises = bookings.map((booking) =>
      Bike.findByIdAndUpdate(booking.bike, { status: "provided for rent" })
    );

    // Delete the bookings
    const bookingDeletePromise = Booking.deleteMany({ _id: { $in: bookingIds } });

    // Clear cart from user and save
    user.cart = [];
    const userSavePromise = user.save();

    await Promise.all([...bikeUpdatePromises, bookingDeletePromise, userSavePromise]);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart.",
      error: error.message,
    });
  }
};

export default clearUserCart;