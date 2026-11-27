/**
 * controllers/tripController.js
 * Full CRUD for trips. Every query is scoped to the logged-in user,
 * so users can only ever see/edit/delete their own trips.
 */
const Trip = require('../models/Trip');
const Memory = require('../models/Memory');
const Expense = require('../models/Expense');
const Destination = require('../models/Destination');

/**
 * GET /api/trips
 * All trips of the logged-in user, newest first, with related counts.
 */
const getTrips = async (req, res) => {
  const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });

  const result = await Promise.all(
    trips.map(async (trip) => {
      const [memoryCount, expenseCount, destinationCount] = await Promise.all([
        Memory.countDocuments({ tripId: trip._id }),
        Expense.countDocuments({ tripId: trip._id }),
        Destination.countDocuments({ tripId: trip._id }),
      ]);
      return { ...trip.toObject(), memoryCount, expenseCount, destinationCount };
    })
  );

  res.json(result);
};

/**
 * GET /api/trips/:id
 * One trip + everything attached to it (memories, expenses, destinations).
 */
const getTripById = async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });

  const [memories, expenses, destinations] = await Promise.all([
    Memory.find({ tripId: trip._id }).sort({ date: -1 }),
    Expense.find({ tripId: trip._id }).sort({ date: -1 }),
    Destination.find({ tripId: trip._id }).sort({ dateVisited: -1 }),
  ]);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  res.json({ trip, memories, expenses, destinations, totalExpense });
};

/**
 * POST /api/trips
 * Create a new trip for the logged-in user.
 */
const createTrip = async (req, res) => {
  const { tripName, destination, country, startDate, endDate, description, travelType, budget, coverImage } = req.body;

  if (!tripName || !tripName.trim()) return res.status(400).json({ message: 'Trip name is required' });
  if (!destination || !destination.trim()) return res.status(400).json({ message: 'Destination is required' });
  if (!startDate || !endDate) return res.status(400).json({ message: 'Start and end dates are required' });
  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ message: 'End date cannot be before start date' });
  }

  const trip = await Trip.create({
    userId: req.user._id,
    tripName: tripName.trim(),
    destination: destination.trim(),
    country: country || '',
    startDate,
    endDate,
    description: description || '',
    travelType: travelType || 'Solo',
    budget: Number(budget) || 0,
    coverImage: coverImage || '',
  });

  res.status(201).json(trip);
};

/**
 * PUT /api/trips/:id
 * Update a trip (only the owner).
 */
const updateTrip = async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });

  const { tripName, destination, country, startDate, endDate, description, travelType, budget, coverImage } = req.body;

  if (tripName !== undefined) trip.tripName = tripName.trim();
  if (destination !== undefined) trip.destination = destination.trim();
  if (country !== undefined) trip.country = country;
  if (startDate !== undefined) trip.startDate = startDate;
  if (endDate !== undefined) trip.endDate = endDate;
  if (description !== undefined) trip.description = description;
  if (travelType !== undefined) trip.travelType = travelType;
  if (budget !== undefined) trip.budget = Number(budget) || 0;
  if (coverImage !== undefined) trip.coverImage = coverImage;

  if (trip.endDate && trip.startDate && new Date(trip.endDate) < new Date(trip.startDate)) {
    return res.status(400).json({ message: 'End date cannot be before start date' });
  }

  await trip.save();
  res.json(trip);
};

/**
 * DELETE /api/trips/:id
 * Delete a trip and cascade-delete all of its memories, expenses and destinations.
 */
const deleteTrip = async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });

  await Promise.all([
    Memory.deleteMany({ tripId: trip._id }),
    Expense.deleteMany({ tripId: trip._id }),
    Destination.deleteMany({ tripId: trip._id }),
  ]);
  await trip.deleteOne();

  res.json({ message: 'Trip and all its related data deleted' });
};

module.exports = { getTrips, getTripById, createTrip, updateTrip, deleteTrip };
