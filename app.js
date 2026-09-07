const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));

module.exports = app;