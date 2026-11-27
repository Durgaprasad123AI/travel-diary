/**
 * routes/exploreRoutes.js — NEW (Explore feature), all protected.
 */
const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getExploreTrips,
  getExploreTrip,
  rateTrip,
  getComments,
  addComment,
  deleteComment,
} = require('../controllers/exploreController');

router.get('/', protect, getExploreTrips);                       // public feed (other users' trips)
router.get('/:id', protect, getExploreTrip);                     // one public trip
router.post('/:id/rate', protect, rateTrip);                     // rate a trip (1–5)
router.get('/:id/comments', protect, getComments);               // comments of a trip
router.post('/:id/comments', protect, addComment);               // add a comment
router.delete('/comments/:commentId', protect, deleteComment);   // delete own comment

module.exports = router;
