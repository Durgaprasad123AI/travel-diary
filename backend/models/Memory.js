/**
 * models/Memory.js
 * A diary entry. Optionally linked to a trip (tripId).
 */
const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Memory must belong to a user'],
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: { type: String, default: '', trim: true, maxlength: [3000, 'Description too long'] },
    date: { type: Date, default: Date.now },
    mood: {
      type: String,
      enum: ['Happy', 'Excited', 'Adventurous', 'Relaxed', 'Grateful', 'Tired', 'Nostalgic'],
      default: 'Happy',
    },
    location: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Memory', memorySchema);
