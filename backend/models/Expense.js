/**
 * models/Expense.js
 * A travel expense record, optionally linked to a trip.
 */
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Expense must belong to a user'],
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Expense name is required'],
      trim: true,
      maxlength: [100, 'Expense name too long'],
    },
    category: {
      type: String,
      enum: ['Food', 'Transport', 'Hotel', 'Shopping', 'Entertainment', 'Other'],
      default: 'Other',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    date: { type: Date, default: Date.now },
    description: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
