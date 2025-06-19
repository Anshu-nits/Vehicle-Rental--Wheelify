import User from "../../Models/User.js";

const getWithdrawalHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("withdrawalHistory");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Sort the withdrawal history by timestamp (newest first)
    const sortedHistory = (user.withdrawalHistory || []).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Format the data to match frontend expectations
    const formattedHistory = sortedHistory.map(withdrawal => ({
      ...withdrawal.toObject(),
      type: 'withdrawal', // Add type for frontend filtering
      title: 'Withdrawal',
      description: 'Money withdrawn from wallet'
    }));

    res.status(200).json({
      success: true,
      message: "Withdrawal history fetched successfully",
      history: formattedHistory,
    });
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default getWithdrawalHistory;