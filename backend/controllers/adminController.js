/**
 * controllers/adminController.js
 * All admin-panel APIs. Every route here is protected by
 * the `protect` + `admin` middleware (see routes/adminRoutes.js).
 */
const User = require('../models/User');
const Trip = require('../models/Trip');
const Memory = require('../models/Memory');
const Expense = require('../models/Expense');
const Destination = require('../models/Destination');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * GET /api/admin/stats — dashboard numbers.
 */
const getStats = async (req, res) => {
  const [users, trips, memories, expenses, destinations, totalExpenseAgg, recentUsers] = await Promise.all([
    User.countDocuments(),
    Trip.countDocuments(),
    Memory.countDocuments(),
    Expense.countDocuments(),
    Destination.countDocuments(),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    User.find().sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    users,
    trips,
    memories,
    expenses,
    destinations,
    totalExpense: totalExpenseAgg[0] ? totalExpenseAgg[0].total : 0,
    recentUsers,
  });
};

/**
 * GET /api/admin/users?search=... — list users with per-user trip counts.
 */
const getUsers = async (req, res) => {
  const search = (req.query.search || '').trim();
  const filter = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};

  const users = await User.find(filter).sort({ createdAt: -1 });

  const result = await Promise.all(
    users.map(async (u) => ({
      ...u.toObject(),
      tripCount: await Trip.countDocuments({ userId: u._id }),
    }))
  );

  res.json(result);
};

/**
 * GET /api/admin/users/:id — full detail of one user + their data.
 */
const getUserDetails = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const [trips, memories, expenses, destinations, totalExpenseAgg] = await Promise.all([
    Trip.find({ userId: user._id }).sort({ createdAt: -1 }),
    Memory.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10),
    Expense.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10),
    Destination.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10),
    Expense.aggregate([{ $match: { userId: user._id } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);

  res.json({
    user,
    stats: {
      trips: trips.length,
      memories: memories.length,
      expenses: expenses.length,
      destinations: destinations.length,
      totalExpense: totalExpenseAgg[0] ? totalExpenseAgg[0].total : 0,
    },
    trips,
    memories,
    expenses,
    destinations,
  });
};

/**
 * PUT /api/admin/users/:id — edit name / email / role.
 */
const updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (name !== undefined) user.name = name.trim() || user.name;
  if (email !== undefined && /^\S+@\S+\.\S+$/.test(email)) {
    const exists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (!exists) user.email = email.toLowerCase();
  }
  if (role !== undefined && ['user', 'admin'].includes(role)) {
    user.role = role;
  }

  await user.save();
  res.json({ message: 'User updated', user });
};

/**
 * DELETE /api/admin/users/:id — delete a user and cascade all their data.
 */
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') {
    return res.status(400).json({ message: 'Admin accounts cannot be deleted' });
  }

  const tripIds = (await Trip.find({ userId: user._id }, '_id')).map((t) => t._id);

  await Trip.deleteMany({ userId: user._id });
  await Memory.deleteMany({ userId: user._id, $or: [{ tripId: { $in: tripIds } }, { tripId: null }] });
  await Expense.deleteMany({ userId: user._id, $or: [{ tripId: { $in: tripIds } }, { tripId: null }] });
  await Destination.deleteMany({ userId: user._id, $or: [{ tripId: { $in: tripIds } }, { tripId: null }] });
  await user.deleteOne();

  res.json({ message: 'User and all related data deleted' });
};

/**
 * GET /api/admin/trips?search=... — all trips with the owner populated.
 */
const getAllTrips = async (req, res) => {
  const search = (req.query.search || '').trim();
  const filter = search
    ? { $or: [{ tripName: { $regex: search, $options: 'i' } }, { destination: { $regex: search, $options: 'i' } }] }
    : {};

  const trips = await Trip.find(filter).populate('userId', 'name email profileImage').sort({ createdAt: -1 });
  res.json(trips);
};

/**
 * PUT /api/admin/trips/:id — admin edit of a trip.
 */
const updateTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: 'Trip not found' });

  const { tripName, destination, country, startDate, endDate, description, travelType, budget } = req.body;
  if (tripName !== undefined) trip.tripName = tripName.trim() || trip.tripName;
  if (destination !== undefined) trip.destination = destination.trim() || trip.destination;
  if (country !== undefined) trip.country = country;
  if (startDate !== undefined) trip.startDate = startDate;
  if (endDate !== undefined) trip.endDate = endDate;
  if (description !== undefined) trip.description = description;
  if (travelType !== undefined) trip.travelType = travelType;
  if (budget !== undefined) trip.budget = Number(budget) || 0;

  await trip.save();
  res.json({ message: 'Trip updated', trip });
};

/**
 * DELETE /api/admin/trips/:id — delete any trip (cascades children).
 */
const deleteTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: 'Trip not found' });

  await Promise.all([
    Memory.deleteMany({ tripId: trip._id }),
    Expense.deleteMany({ tripId: trip._id }),
    Destination.deleteMany({ tripId: trip._id }),
  ]);
  await trip.deleteOne();

  res.json({ message: 'Trip and its related data deleted' });
};

/**
 * GET /api/admin/memories — all memories with owner populated.
 */
const getAllMemories = async (req, res) => {
  const memories = await Memory.find()
    .populate('userId', 'name email')
    .populate('tripId', 'tripName')
    .sort({ createdAt: -1 });
  res.json(memories);
};

/**
 * DELETE /api/admin/memories/:id — remove an inappropriate memory.
 */
const deleteMemory = async (req, res) => {
  const memory = await Memory.findById(req.params.id);
  if (!memory) return res.status(404).json({ message: 'Memory not found' });
  await memory.deleteOne();
  res.json({ message: 'Memory deleted' });
};

/**
 * GET /api/admin/expenses — all expenses with owner populated.
 */
const getAllExpenses = async (req, res) => {
  const expenses = await Expense.find()
    .populate('userId', 'name email')
    .populate('tripId', 'tripName')
    .sort({ createdAt: -1 })
    .limit(200);
  res.json(expenses);
};

/**
 * GET /api/admin/destinations — all destinations with owner populated.
 */
const getAllDestinations = async (req, res) => {
  const destinations = await Destination.find()
    .populate('userId', 'name email')
    .populate('tripId', 'tripName')
    .sort({ createdAt: -1 })
    .limit(200);
  res.json(destinations);
};

/**
 * GET /api/admin/reports — aggregates for the Reports page.
 */
const getReports = async (req, res) => {
  const [categoryAgg, tripsByMonthAgg, topDestinations, totals] = await Promise.all([
    Expense.aggregate([{ $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }, { $sort: { total: -1 } }]),
    Trip.aggregate([{ $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Trip.aggregate([
      { $group: { _id: '$destination', country: { $first: '$country' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      Memory.countDocuments(),
      Expense.countDocuments(),
      Destination.countDocuments(),
    ]),
  ]);

  res.json({
    expenseCategories: categoryAgg,
    tripsByMonth: tripsByMonthAgg.map((t) => ({ month: MONTHS[t._id - 1], count: t.count })),
    topDestinations,
    totals: {
      users: totals[0],
      trips: totals[1],
      memories: totals[2],
      expenses: totals[3],
      destinations: totals[4],
    },
  });
};

/**
 * DELETE /api/admin/data/:collection
 * Bulk management: wipe all records of one collection.
 * collection ∈ { memories, expenses, destinations, trips }
 */
const clearCollection = async (req, res) => {
  const { collection } = req.params;
  const allowed = { memories: Memory, expenses: Expense, destinations: Destination, trips: Trip };

  if (!allowed[collection]) {
    return res.status(400).json({ message: 'Invalid collection' });
  }

  if (collection === 'trips') {
    await Promise.all([Memory.deleteMany({}), Expense.deleteMany({}), Destination.deleteMany({})]);
  }
  await allowed[collection].deleteMany({});

  res.json({ message: `All ${collection} have been deleted` });
};

module.exports = {
  getStats,
  getUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  getAllTrips,
  updateTrip,
  deleteTrip,
  getAllMemories,
  deleteMemory,
  getAllExpenses,
  getAllDestinations,
  getReports,
  clearCollection,
};
