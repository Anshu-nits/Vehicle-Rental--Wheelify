import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
  address: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  registeredBikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
    },
  ],
  providedBikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
    },
  ],
  userBalance: {
    type: Number,
    default: 0,
  },

  // RENTAL HISTORY (for all booking status types)
  history: [
    {
      booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
      },
      type: {
        type: String,
        enum: ['credit', 'debit', 'cancellation'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    }
  ],

  // TRANSACTION HISTORY (for rent payments)
  transactionHistory: [
    {
      booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
      },
      type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }
  ],

  // NEW: Deposit History
  depositHistory: [
    {
      amount: {
        type: Number,
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }
  ],

  // NEW: Withdrawal History
  withdrawalHistory: [
    {
      amount: {
        type: Number,
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }
  ],

  // NEW: Refund History
  refundHistory: [
    {
      amount: {
        type: Number,
        required: true,
      },
      reason: {
        type: String,
        default: "General refund",
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }
  ],

  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;