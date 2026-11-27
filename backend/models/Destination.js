/**
 * models/Destination.js
 * A place the user visited, optionally linked to a trip.
 */
const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Destination must belong to a user'],
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    location: { type: String, default: '', trim: true },
    dateVisited: { type: Date, default: Date.now },
    description: { type: String, default: '', trim: true, maxlength: [1500, 'Description too long'] },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
