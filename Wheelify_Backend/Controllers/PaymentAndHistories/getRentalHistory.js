import User from "../../Models/User.js";
import Booking from "../../Models/Booking.js";
import Bike from "../../Models/Bike.js";

const getRentalHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("history").lean();

    if (!user || !user.history || user.history.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No rental history found",
        data: [],
      });
    }

    const seenBookingIds = new Set();
    const uniqueHistory = user.history.filter((entry) => {
      if (!entry.booking) return false;
      const idStr = entry.booking.toString();
      if (seenBookingIds.has(idStr)) return false;
      seenBookingIds.add(idStr);
      return true;
    });

    const bookingData = await Promise.all(
      uniqueHistory.map(async (historyItem) => {
        const booking = await Booking.findById(historyItem.booking)
          .populate({
            path: "bike",
            select: "company model img Owner",
            populate: {
              path: "Owner",
              select: "name",
            },
          })
          .populate("owner", "name")
          .lean();

        if (!booking) return null;

        const bike = booking.bike;
        const owner = booking.owner || bike?.Owner;

        const startDate = booking.availableDateFrom;
        const endDate = booking.availableDateTill;
        const durationDays = Math.ceil(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        );

        const formatDate = (date) => {
          return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        return {
          bookingId: booking.bookingId,
          historyId: historyItem._id,
          status: booking.status, // ✅ send the ACTUAL booking.status
          title: `${bike?.company || "Unknown"} ${bike?.model || "Bike"}`,
          pickup: booking.location,
          owner: owner?.name || "Unknown Owner",
          start: formatDate(booking.availableDateFrom),
          end: formatDate(booking.availableDateTill),
          duration: `${durationDays} ${durationDays === 1 ? "day" : "days"}`,
          rate: `$${booking.rentAmount || 0}/day`,
          total: `$${(booking.rentAmount * durationDays).toFixed(2)}`,
          deposit: "$30.00",
          refund: booking.status === "cancelled" ? `$${booking.rentAmount || 0}.00` : undefined,
          fee: booking.status === "cancelled" ? "$0.00" : undefined,
          rating: 0,
          timestamps: booking.timestamps,
          bikeImage: bike?.img || "",
          historyType: historyItem.type,
          historyAmount: historyItem.amount,
        };
      })
    );

    const validData = bookingData.filter(Boolean);

    res.status(200).json({
      success: true,
      message: "Rental history fetched successfully",
      data: validData,
    });
  } catch (error) {
    console.error("Error fetching rental history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rental history",
      error: error.message,
    });
  }
};

export default getRentalHistory;