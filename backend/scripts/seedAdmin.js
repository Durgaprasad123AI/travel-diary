/**
 * scripts/seedAdmin.js
 * Creates the default admin account (role: 'admin').
 *
 * Run:  npm run seed:admin
 * The credentials come from .env (ADMIN_EMAIL / ADMIN_PASSWORD).
 */
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = (process.env.ADMIN_EMAIL || 'admin@traveldiary.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    const exists = await User.findOne({ email });
    if (exists) {
      console.log(`ℹ️  Admin account already exists: ${email}`);
      process.exit(0);
    }

    await User.create({ name: 'Travel Diary Admin', email, password, role: 'admin' });
    console.log('✅ Admin account created:');
    console.log(`   Email   : ${email}`);
    console.log(`   Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
