const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/consultancy', require('./routes/consultancy'));
app.use('/api/seminars', require('./routes/seminars'));
app.use('/api/workshops', require('./routes/workshops'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/voluntary', require('./routes/voluntary'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

// Clean HTML Route Mappings for frontend pages
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'products.html'));
});
app.get('/consultancy', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'consultancy.html'));
});
app.get('/seminars', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'seminars.html'));
});
app.get('/workshops', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'workshops.html'));
});
app.get('/voluntary', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'voluntary.html'));
});
app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'portfolio.html'));
});
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
});

// Fallback route for HTML navigation
app.get('*', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  } else {
    res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error stack:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✨ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 Web Application: http://localhost:${PORT}`);
  console.log(`🛡️ Admin Dashboard: http://localhost:${PORT}/admin.html`);
});
