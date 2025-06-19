import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";
import Booking from "../../Models/Booking.js";

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Mark bookings where user was renter or owner
    await Booking.updateMany(
      { renter: userId },
      { $set: { renter: null, note: "Renter deleted" } }
    );

    await Booking.updateMany(
      { owner: userId },
      { $set: { owner: null, note: "Owner deleted" } }
    );

    // Delete owned bikes
    await Bike.deleteMany({ Owner: userId });

    // Remove booking references from user's own cart/history/transactions
    // But do NOT delete bookings themselves
    await User.updateMany(
      {},
      {
        $pull: {
          cart: { $in: user.cart },
          history: { booking: { $in: user.history.map(h => h.booking) } },
          transactionHistory: { booking: { $in: user.transactionHistory.map(t => t.booking) } },
        },
      }
    );

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted. Bookings preserved for record integrity.",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting account",
    });
  }
};


export default deleteAccount;