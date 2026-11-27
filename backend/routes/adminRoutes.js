/**
 * routes/adminRoutes.js
 * Every route uses protect + admin → only logged-in admins can access.
 */
const router = require('express').Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/adminController');

// Dashboard stats
router.get('/stats', protect, admin, getStats);

// Users
router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserDetails);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

// Trips
router.get('/trips', protect, admin, getAllTrips);
router.put('/trips/:id', protect, admin, updateTrip);
router.delete('/trips/:id', protect, admin, deleteTrip);

// Memories
router.get('/memories', protect, admin, getAllMemories);
router.delete('/memories/:id', protect, admin, deleteMemory);

// Expenses & destinations
router.get('/expenses', protect, admin, getAllExpenses);
router.get('/destinations', protect, admin, getAllDestinations);

// Reports & data management
router.get('/reports', protect, admin, getReports);
router.delete('/data/:collection', protect, admin, clearCollection);

module.exports = router;
