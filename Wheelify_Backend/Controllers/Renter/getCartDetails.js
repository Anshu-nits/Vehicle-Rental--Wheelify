import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";
import Booking from "../../Models/Booking.js";

const getCartDetails = async (req, res) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).populate({
      path: 'cart',
      model: 'Booking',
      populate: [
        {
          path: 'bike',
          model: 'Bike'
        },
        {
          path: 'renter',
          model: 'User',
          select: 'name email'
        },
        {
          path: 'owner',
          model: 'User',
          select: 'name email'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Filter out deleted or null bookings (if any)
    const validCartItems = user.cart.filter(booking => booking && booking.bike);

    return res.status(200).json({
      success: true,
      cartItems: validCartItems,
      count: validCartItems.length,
    });
  } catch (error) {
    console.error("Get cart details error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart details.",
      error: error.message,
    });
  }
};

export default getCartDetails;