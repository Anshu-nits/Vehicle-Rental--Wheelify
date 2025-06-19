import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Ensure one rating per user
ratingSchema.index({ user: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);

