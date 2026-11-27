/**
 * routes/memoryRoutes.js — all protected.
 */
const router = require('express').Router();
const {
  getMemories,
  getMemoryById,
  createMemory,
  updateMemory,
  deleteMemory,
} = require('../controllers/memoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMemories).post(protect, createMemory);
router.route('/:id').get(protect, getMemoryById).put(protect, updateMemory).delete(protect, deleteMemory);

module.exports = router;
