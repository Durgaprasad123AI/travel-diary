/**
 * models/Comment.js — NEW (Explore feature)
 * A comment left by a user on another user's trip.
 */
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: {
      type: String,
      required: [true, 'Comment cannot be empty'],
      trim: true,
      maxlength: [500, 'Comment is too long (max 500 characters)'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
