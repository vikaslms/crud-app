const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();



const app = express();
const PORT = process.env.PORT || 3000;

// ← add this BEFORE your routes
app.use(cors({
  origin: 'http://localhost:3002',  // your React app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);      // Auth routes (public)
app.use('/api/users', userRoutes);     // CRUD routes (protected)

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 Node.js MySQL CRUD API with JWT Auth is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
