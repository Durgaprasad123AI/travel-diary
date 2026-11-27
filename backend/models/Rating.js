/**
 * models/Rating.js — NEW (Explore feature)
 * A 1–5 star rating given by a user to another user's trip.
 * Unique per (tripId + userId) → one rating per user per trip.
 */
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

ratingSchema.index({ tripId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
