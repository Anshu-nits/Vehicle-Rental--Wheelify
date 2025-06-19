import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    // Remove the default uuidv4 - we'll generate it manually in createBooking
  },
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bike",
    required: true,
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rentAmount: {
    type: Number,
    required: true,
  },
  // Add period field to match your frontend
  period: {
    type: Number,
    default: 1,
  },
  availableTimeFrom: {
    type: Date,
    required: true,
  },
  availableTimeTill: {
    type: Date,
    required: true,
  },
  availableDateFrom: {
    type: Date,
    required: true,
  },
  availableDateTill: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["booked", "rented", "picked up", "returned", "cancelled", "expired"],
    default: "booked",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  timestamps: {
    bookedAt: { type: Date, default: Date.now },
    pickedUpAt: Date,
    returnedAt: Date,
    cancelledAt: Date,
    paidAt: Date,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;