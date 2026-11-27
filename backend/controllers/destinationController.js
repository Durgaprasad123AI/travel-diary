/**
 * controllers/destinationController.js
 * CRUD for saved places (destinations), scoped to the logged-in user.
 */
const Destination = require('../models/Destination');

/**
 * GET /api/destinations?tripId=<id>
 */
const getDestinations = async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.tripId) filter.tripId = req.query.tripId;

  const destinations = await Destination.find(filter).sort({ dateVisited: -1 });
  res.json(destinations);
};

/**
 * POST /api/destinations
 */
const createDestination = async (req, res) => {
  const { name, location, dateVisited, description, rating, image, tripId } = req.body;

  if (!name || !name.trim()) return res.status(400).json({ message: 'Place name is required' });

  const destination = await Destination.create({
    userId: req.user._id,
    tripId: tripId || null,
    name: name.trim(),
    location: location || '',
    dateVisited: dateVisited || Date.now(),
    description: description || '',
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    image: image || '',
  });

  res.status(201).json(destination);
};

/**
 * PUT /api/destinations/:id
 */
const updateDestination = async (req, res) => {
  const destination = await Destination.findOne({ _id: req.params.id, userId: req.user._id });
  if (!destination) return res.status(404).json({ message: 'Destination not found' });

  const { name, location, dateVisited, description, rating, image, tripId } = req.body;
  if (name !== undefined) destination.name = name.trim();
  if (location !== undefined) destination.location = location;
  if (dateVisited !== undefined) destination.dateVisited = dateVisited;
  if (description !== undefined) destination.description = description;
  if (rating !== undefined) destination.rating = Math.min(5, Math.max(1, Number(rating) || 5));
  if (image !== undefined) destination.image = image;
  if (tripId !== undefined) destination.tripId = tripId || null;

  await destination.save();
  res.json(destination);
};

/**
 * DELETE /api/destinations/:id
 */
const deleteDestination = async (req, res) => {
  const destination = await Destination.findOne({ _id: req.params.id, userId: req.user._id });
  if (!destination) return res.status(404).json({ message: 'Destination not found' });

  await destination.deleteOne();
  res.json({ message: 'Destination deleted' });
};

module.exports = { getDestinations, createDestination, updateDestination, deleteDestination };
