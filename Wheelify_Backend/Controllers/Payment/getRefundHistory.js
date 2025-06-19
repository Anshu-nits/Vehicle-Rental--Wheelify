import User from "../../Models/User.js";

const getRefundHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("refundHistory");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Sort the refund history by timestamp (newest first)
    const sortedHistory = (user.refundHistory || []).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Format the data to match frontend expectations
    const formattedHistory = sortedHistory.map(refund => ({
      ...refund.toObject(),
      type: 'refund', // Add type for frontend filtering
      title: 'Refund',
      description: refund.reason || 'Refund processed'
    }));

    res.status(200).json({
      success: true,
      message: "Refund history fetched successfully",
      history: formattedHistory,
    });
  } catch (error) {
    console.error("Error fetching refund history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default getRefundHistory;