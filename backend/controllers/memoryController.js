/**
 * controllers/memoryController.js
 * CRUD for diary memories, scoped to the logged-in user.
 */
const Memory = require('../models/Memory');

/**
 * GET /api/memories?tripId=<id>
 * All memories of the user; optionally filter by trip.
 */
const getMemories = async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.tripId) filter.tripId = req.query.tripId;

  const memories = await Memory.find(filter).sort({ date: -1 });
  res.json(memories);
};

/**
 * GET /api/memories/:id
 */
const getMemoryById = async (req, res) => {
  const memory = await Memory.findOne({ _id: req.params.id, userId: req.user._id });
  if (!memory) return res.status(404).json({ message: 'Memory not found' });
  res.json(memory);
};

/**
 * POST /api/memories
 */
const createMemory = async (req, res) => {
  const { title, description, date, mood, location, image, tripId } = req.body;

  if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });

  const memory = await Memory.create({
    userId: req.user._id,
    tripId: tripId || null,
    title: title.trim(),
    description: description || '',
    date: date || Date.now(),
    mood: mood || 'Happy',
    location: location || '',
    image: image || '',
  });

  res.status(201).json(memory);
};

/**
 * PUT /api/memories/:id
 */
const updateMemory = async (req, res) => {
  const memory = await Memory.findOne({ _id: req.params.id, userId: req.user._id });
  if (!memory) return res.status(404).json({ message: 'Memory not found' });

  const { title, description, date, mood, location, image, tripId } = req.body;
  if (title !== undefined) memory.title = title.trim();
  if (description !== undefined) memory.description = description;
  if (date !== undefined) memory.date = date;
  if (mood !== undefined) memory.mood = mood;
  if (location !== undefined) memory.location = location;
  if (image !== undefined) memory.image = image;
  if (tripId !== undefined) memory.tripId = tripId || null;

  await memory.save();
  res.json(memory);
};

/**
 * DELETE /api/memories/:id
 */
const deleteMemory = async (req, res) => {
  const memory = await Memory.findOne({ _id: req.params.id, userId: req.user._id });
  if (!memory) return res.status(404).json({ message: 'Memory not found' });

  await memory.deleteOne();
  res.json({ message: 'Memory deleted' });
};

module.exports = { getMemories, getMemoryById, createMemory, updateMemory, deleteMemory };
