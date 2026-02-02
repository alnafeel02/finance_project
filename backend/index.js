const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Import Routes
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');
const admin = require('./routes/admin');
const products = require('./routes/products');
const notifications = require('./routes/notifications');
const contact = require('./routes/contact');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', admin);
app.use('/api/products', products);
app.use('/api/notifications', notifications);
app.use('/api/contact', contact);
app.use('/api/support', require('./routes/support'));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'FinanceHub API is running...' });
});

// Port
const PORT = process.env.PORT || 5000;

// Database Connection & Server Start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1);
  });
