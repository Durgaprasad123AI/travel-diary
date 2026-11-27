/**
 * controllers/exploreController.js — NEW (Explore feature)
 * Public feed of OTHER users' trips + rating + commenting.
 * A user's own trips never appear here (they stay in "My Trips").
 */
const Trip = require('../models/Trip');
const Memory = require('../models/Memory');
const Expense = require('../models/Expense');
const Destination = require('../models/Destination');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');

/**
 * GET /api/explore?search=...&sort=recent|top
 * All trips created by OTHER users, with average rating, rating count
 * and comment count attached.
 */
const getExploreTrips = async (req, res) => {
  const userId = req.user._id;
  const search = (req.query.search || '').trim();
  const sort = req.query.sort || 'recent';

  const filter = { userId: { $ne: userId } }; // exclude my own trips
  if (search) {
    filter.$or = [
      { tripName: { $regex: search, $options: 'i' } },
      { destination: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } },
    ];
  }

  let trips = await Trip.find(filter).populate('userId', 'name email profileImage');
  const tripIds = trips.map((t) => t._id);

  const [ratingAgg, commentAgg] = await Promise.all([
    Rating.aggregate([
      { $match: { tripId: { $in: tripIds } } },
      { $group: { _id: '$tripId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]),
    Comment.aggregate([
      { $match: { tripId: { $in: tripIds } } },
      { $group: { _id: '$tripId', count: { $sum: 1 } } },
    ]),
  ]);

  const ratingMap = new Map(ratingAgg.map((r) => [String(r._id), r]));
  const commentMap = new Map(commentAgg.map((c) => [String(c._id), c]));

  trips = trips.map((t) => {
    const r = ratingMap.get(String(t._id));
    return {
      ...t.toObject(),
      avgRating: r ? Math.round(r.avg * 10) / 10 : 0,
      ratingCount: r ? r.count : 0,
      commentCount: commentMap.get(String(t._id)) ? commentMap.get(String(t._id)).count : 0,
    };
  });

  if (sort === 'top') {
    trips.sort((a, b) => b.avgRating - a.avgRating || b.ratingCount - a.ratingCount);
  } else {
    trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(trips);
};

/**
 * GET /api/explore/:id
 * Full public view of one trip: owner, memories, expenses, destinations,
 * average rating, my rating and all comments.
 */
const getExploreTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate('userId', 'name email profileImage');
  if (!trip) return res.status(404).json({ message: 'Trip not found' });

  // Owners view their own trips from "My Trips", not from Explore
  if (String(trip.userId._id) === String(req.user._id)) {
    return res.status(400).json({ message: 'This is your own trip — open it from My Trips' });
  }

  const [memories, expenses, destinations, ratingAgg, comments] = await Promise.all([
    Memory.find({ tripId: trip._id }).sort({ date: -1 }),
    Expense.find({ tripId: trip._id }).sort({ date: -1 }),
    Destination.find({ tripId: trip._id }).sort({ dateVisited: -1 }),
    Rating.aggregate([
      { $match: { tripId: trip._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]),
    Comment.find({ tripId: trip._id }).populate('userId', 'name profileImage').sort({ createdAt: -1 }),
  ]);

  const myRating = await Rating.findOne({ tripId: trip._id, userId: req.user._id });
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  res.json({
    trip,
    memories,
    expenses,
    destinations,
    totalExpense,
    avgRating: ratingAgg[0] ? Math.round(ratingAgg[0].avg * 10) / 10 : 0,
    ratingCount: ratingAgg[0] ? ratingAgg[0].count : 0,
    myRating: myRating ? myRating.rating : 0,
    comments,
  });
};

/**
 * POST /api/explore/:id/rate   body: { rating: 1..5 }
 * Upserts the caller's rating (re-rating overwrites the old one).
 */
const rateTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  if (String(trip.userId) === String(req.user._id)) {
    return res.status(400).json({ message: 'You cannot rate your own trip' });
  }

  const value = Math.round(Number(req.body.rating));
  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
  }

  const updated = await Rating.findOneAndUpdate(
    { tripId: trip._id, userId: req.user._id },
    { rating: value },
    { upsert: true, new: true }
  );

  res.json({ message: 'Rating saved', rating: updated.rating });
};

/**
 * GET /api/explore/:id/comments
 */
const getComments = async (req, res) => {
  const comments = await Comment.find({ tripId: req.params.id })
    .populate('userId', 'name profileImage')
    .sort({ createdAt: -1 });
  res.json(comments);
};

/**
 * POST /api/explore/:id/comments   body: { text }
 */
const addComment = async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });

  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: 'Trip not found' });

  const comment = await Comment.create({ tripId: trip._id, userId: req.user._id, text });
  await comment.populate('userId', 'name profileImage');
  res.status(201).json(comment);
};

/**
 * DELETE /api/explore/comments/:commentId — only the author can delete.
 */
const deleteComment = async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.commentId, userId: req.user._id });
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
};

module.exports = { getExploreTrips, getExploreTrip, rateTrip, getComments, addComment, deleteComment };
