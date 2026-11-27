/**
 * controllers/authController.js
 * Handles registration, user login, admin login and "who am I".
 * Passwords are hashed by the User model (bcrypt); sessions use JWT.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Create a signed JWT for a user id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Build the JSON response body returned after successful auth
const authResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage || '',
  createdAt: user.createdAt,
  token: generateToken(user._id),
});

/**
 * POST /api/auth/register
 * Validate input → check duplicate email → create user (bcrypt hashes password) → return token.
 */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // --- Input validation with clear messages ---
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Name cannot be empty' });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // --- Duplicate check ---
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return res.status(400).json({ message: 'An account with this email already exists. Try logging in.' });
  }

  // --- Create (the pre-save hook hashes the password) ---
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
  });

  res.status(201).json(authResponse(user));
};

/**
 * POST /api/auth/login
 * Normal user login. Admin accounts are rejected here — they must use /api/auth/admin/login.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password' });
  }

  // .select('+password') because the schema hides it by default
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'No account found with this email' });
  }
  if (user.role !== 'user') {
    return res.status(403).json({ message: 'This is an admin account. Please use the Admin Login page.' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect password. Please try again.' });
  }

  res.json(authResponse(user));
};

/**
 * POST /api/auth/admin/login
 * Separate admin-only login. Only role === 'admin' accounts may pass.
 */
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || user.role !== 'admin') {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  res.json(authResponse(user));
};

/**
 * GET /api/auth/me
 * Returns the currently logged-in user (requires valid JWT).
 */
const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    profileImage: req.user.profileImage || '',
    createdAt: req.user.createdAt,
  });
};

module.exports = { registerUser, loginUser, adminLogin, getMe };
