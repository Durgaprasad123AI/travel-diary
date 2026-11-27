
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


dotenv.config();

connectDB();

const app = express();



app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', require('./routes/authRoutes'));          
app.use('/api/users', require('./routes/userRoutes'));          
app.use('/api/trips', require('./routes/tripRoutes'));        
app.use('/api/memories', require('./routes/memoryRoutes'));    
app.use('/api/expenses', require('./routes/expenseRoutes'));    
app.use('/api/destinations', require('./routes/destinationRoutes')); 
app.use('/api/admin', require('./routes/adminRoutes'));       
app.use('/api/explore', require('./routes/exploreRoutes'));       
app.use('/api/upload', require('./routes/uploadRoutes'));       

// Root health check
app.get('/', (req, res) => {
  res.json({
    message: 'Travel Diary API is running 🚀',
    endpoints: ['/api/auth', '/api/users', '/api/trips', '/api/memories', '/api/expenses', '/api/destinations', '/api/admin', '/api/upload'],
  });
});

// 404 handler + central error handler (always last)
app.use(notFound);
app.use(errorHandler);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Travel Diary server running on http://localhost:${PORT}`);
});
