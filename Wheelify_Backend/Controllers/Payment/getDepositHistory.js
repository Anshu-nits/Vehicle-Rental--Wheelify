import User from "../../Models/User.js";

const getDepositHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("depositHistory");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Sort the deposit history by timestamp (newest first)
    const sortedHistory = (user.depositHistory || []).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Format the data to match frontend expectations
    const formattedHistory = sortedHistory.map(deposit => ({
      ...deposit.toObject(),
      type: 'deposit', // Add type for frontend filtering
      title: 'Deposit',
      description: 'Money deposited to wallet'
    }));

    res.status(200).json({
      success: true,
      message: "Deposit history fetched successfully",
      history: formattedHistory,
    });
  } catch (error) {
    console.error("Error fetching deposit history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default getDepositHistory;