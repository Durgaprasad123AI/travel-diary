/**
 * routes/authRoutes.js
 */
const router = require('express').Router();
const { registerUser, loginUser, adminLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);        // public
router.post('/login', loginUser);              // public (users only)
router.post('/admin/login', adminLogin);       // public (admins only)
router.get('/me', protect, getMe);             // protected

module.exports = router;
