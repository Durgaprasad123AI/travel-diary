/**
 * routes/destinationRoutes.js — all protected.
 */
const router = require('express').Router();
const {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDestinations).post(protect, createDestination);
router.route('/:id').put(protect, updateDestination).delete(protect, deleteDestination);

module.exports = router;
