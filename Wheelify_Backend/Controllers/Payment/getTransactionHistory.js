import User from "../../Models/User.js";
import Booking from "../../Models/Booking.js";

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("transactionHistory")
      .populate({
        path: "transactionHistory.booking",
        populate: {
          path: "bike",
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const sortedHistory = user.transactionHistory.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.status(200).json({
      success: true,
      message: "Transaction history fetched successfully",
      history: sortedHistory,
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default getTransactionHistory;