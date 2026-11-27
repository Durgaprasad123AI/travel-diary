/**
 * models/Trip.js
 * A trip belongs to a user (userId reference).
 */
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Trip must belong to a user'],
    },
    tripName: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
      maxlength: [100, 'Trip name cannot exceed 100 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    country: { type: String, default: '', trim: true },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    description: { type: String, default: '', trim: true, maxlength: [2000, 'Description too long'] },
    travelType: {
      type: String,
      enum: ['Solo', 'Family', 'Friends', 'Business', 'Couple'],
      default: 'Solo',
    },
    budget: { type: Number, default: 0, min: 0 },
    coverImage: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
