# FinanceHub Backend API

Robust Express.js backend for the Finance application.

## Features
- **JWT Authentication**: Secure register and login.
- **Role-Based Access**: Separate controls for Users and Admins.
- **MVC Architecture**: Clean code separation with Models, Controllers, and Routes.
- **Loan Management**: Apply, track, and review loan applications.
- **Admin Command Center**: Real-time stats and system management.

## Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file (one has been created for you) and add your `MONGODB_URI` and `JWT_SECRET`.

4. Start the server:
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token

### Loans (Private)
- `POST /api/loans/apply` - Apply for a loan
- `GET /api/loans/my-loans` - Get all loans for logged in user
- `GET /api/loans/:id` - Get specific loan details

### Admin (Private/Admin)
- `GET /api/admin/stats` - Get system metrics
- `GET /api/admin/applications` - Get all applications for review
- `PUT /api/admin/loans/:id/status` - Update loan status (Approve/Reject)
- `GET /api/admin/users` - Get user directory
