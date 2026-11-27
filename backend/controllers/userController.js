/**
 * controllers/userController.js
 * Profile APIs: read profile with statistics, update profile, change password.
 */
const User = require('../models/User');
const Trip = require('../models/Trip');
const Memory = require('../models/Memory');
const Expense = require('../models/Expense');
const Destination = require('../models/Destination');

/**
 * GET /api/users/profile
 * Returns the user + aggregate statistics for the dashboard.
 */
const getProfile = async (req, res) => {
  const userId = req.user._id;

  const [trips, memories, expenses, destinations, totalExpenseAgg, recentTrips] = await Promise.all([
    Trip.countDocuments({ userId }),
    Memory.countDocuments({ userId }),
    Expense.countDocuments({ userId }),
    Destination.countDocuments({ userId }),
    Expense.aggregate([{ $match: { userId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Trip.find({ userId }).sort({ createdAt: -1 }).limit(4),
  ]);

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    profileImage: req.user.profileImage || '',
    role: req.user.role,
    createdAt: req.user.createdAt,
    stats: {
      trips,
      memories,
      expenses,
      destinations,
      totalExpense: totalExpenseAgg[0] ? totalExpenseAgg[0].total : 0,
    },
    recentTrips,
  });
};

/**
 * PUT /api/users/profile
 * Update name / email / profile image.
 */
const updateProfile = async (req, res) => {
  const { name, email, profileImage } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ message: 'Name cannot be empty' });
    user.name = name.trim();
  }

  if (email !== undefined) {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    const exists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (exists) return res.status(400).json({ message: 'This email is already in use' });
    user.email = email.toLowerCase();
  }

  if (profileImage !== undefined) user.profileImage = profileImage;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage || '',
  });
};

/**
 * PUT /api/users/password
 * Change password — requires the current password for security.
 */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please fill in both password fields' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword; // pre-save hook re-hashes it
  await user.save();

  res.json({ message: 'Password changed successfully' });
};

module.exports = { getProfile, updateProfile, changePassword };
