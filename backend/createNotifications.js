const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('./models/Notification');
const User = require('./models/User');

dotenv.config();

const createNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({ role: 'user' });
    if (users.length === 0) {
      console.log('No users found to notify');
      process.exit();
    }

    const testUser = users[0];

    const alerts = [
      {
        user: testUser._id,
        title: 'Welcome to FinanceHub',
        message: 'Your account is now active. Explore our loan products today!',
        type: 'info',
        link: '/loan-products'
      },
      {
        user: testUser._id,
        title: 'KYC Verified!',
        message: 'Your identity documents have been approved. You are now a premium member.',
        type: 'success',
        link: '/dashboard'
      },
      {
        user: testUser._id,
        title: 'Payment Reminder',
        message: 'Your monthly EMI is due in 3 days. Please ensure sufficient funds.',
        type: 'warning',
        link: '/dashboard/my-loans'
      }
    ];

    await Notification.deleteMany({ user: testUser._id });
    await Notification.insertMany(alerts);

    console.log(`Demo notifications created for user: ${testUser.email}`);
    process.exit();
  } catch (err) {
    console.error('Error creating notifications:', err);
    process.exit(1);
  }
};

createNotifications();
