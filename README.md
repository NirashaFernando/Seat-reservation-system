# Seat Reservation System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing seat reservations with role-based access control.

## Features

### User Types

- **Intern**: View and reserve available seats
- **Admin**: Full system management including:
  - Add, edit, and remove seats
  - Manage all reservations
  - View system statistics and reports
  - Cancel any reservation

### Core Functionality

- **User Authentication**: JWT-based authentication with role-based access
- **Seat Management**: Interactive seat map with real-time availability
- **Reservation System**: Book and manage seat reservations
- **Admin Dashboard**: Comprehensive system statistics and management tools
- **Responsive Design**: Modern, mobile-friendly interface

## Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Frontend

- **React** with Vite
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API calls
- **Modern CSS** with responsive design

## Database Schema

### Users Collection

- **ID**: MongoDB ObjectId (auto-generated)
- **Name**: String (required)
- **Email**: String (required, unique)
- **Password**: String (required, hashed with bcrypt)
- **Role**: Enum ['intern', 'admin'] (default: 'intern')
- **Timestamps**: createdAt, updatedAt

### Seats Collection

- **ID**: MongoDB ObjectId (auto-generated)
- **Seat Number**: String (required, unique) - e.g., 'A1', 'B2'
- **Row**: String (required) - e.g., 'A', 'B', 'VIP'
- **Location**: String (required) - e.g., 'Main Hall', 'Conference Room A'
- **Area**: String (required) - e.g., 'Floor 1', 'Floor 2'
- **Status**: Enum ['Available', 'Unavailable'] (default: 'Available')
- **Timestamps**: createdAt, updatedAt

### Reservations Collection

- **ID**: MongoDB ObjectId (auto-generated)
- **User ID**: ObjectId reference to Users (required)
- **Seat ID**: ObjectId reference to Seats (required)
- **Date**: Date (required) - reservation date
- **Time Slot**: Enum (required) - Available slots:
  - '09:00-10:00', '10:00-11:00', '11:00-12:00'
  - '12:00-13:00', '13:00-14:00', '14:00-15:00'
  - '15:00-16:00', '16:00-17:00', '17:00-18:00'
- **Status**: Enum ['Active', 'Cancelled'] (default: 'Active')
- **Reserved At**: Date (auto-generated)
- **Timestamps**: createdAt, updatedAt

## Validation Rules

### Business Logic Constraints

1. **One Reservation Per Day**: An intern can only reserve one seat per day
2. **Seat Availability**: Seats cannot be reserved if already booked for the same date and time slot
3. **Advance Booking**: Seats must be reserved at least 1 hour in advance
4. **No Past Dates**: Past dates cannot be booked
5. **Time Slot Conflicts**: Each seat can only be reserved by one user per time slot per day

### API Validation

- All required fields must be provided
- Email must be unique for user registration
- Seat numbers must be unique
- JWT token required for all protected routes
- Admin role required for seat management and viewing all reservations

## Example Seat Map

The system includes a pre-seeded seat map with the following layout:

### Main Hall - Floor 1

```
Row A: [A1] [A2] [A3] [A4] [A5] [A6] [A7] [A8]
Row B: [B1] [B2] [B3] [B4] [B5] [B6] [B7] [B8]
Row C: [C1] [C2] [C3] [C4] [C5] [C6] [C7] [C8]
Row D: [D1] [D2] [D3] [D4] [D5] [D6] [D7] [D8]
```

### VIP Section - Floor 2

```
Row V: [V1] [V2] [V3] [V4] [V5] [V6]
```

### Balcony - Floor 2

```
Row BAL: [BAL1] [BAL2] [BAL3] [BAL4] [BAL5] [BAL6] [BAL7] [BAL8]
```

### Conference Room A - Floor 1

```
Row CR: [CR1] [CR2] [CR3] [CR4] [CR5] [CR6]
```

### Seeding Sample Data

To populate the database with example seats, run:

```bash
cd Backend
node seedSeats.js
```

This will create 52 seats across different locations and areas.

## Prerequisites

Before running this application, ensure you have:

- **Node.js** (v20+ recommended, currently tested with v21.3.0)
- **MongoDB Atlas** account or local MongoDB installation
- **npm** package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Seat-reservation-system
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server

```bash
cd Backend
node app.js
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
Seat-reservation-system/
├── Backend/
│   ├── app.js                 # Main server file
│   ├── package.json
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── user.js           # User model with roles
│   │   ├── seat.js           # Seat model
│   │   └── reservations.js   # Reservation model
│   └── routes/
│       ├── auth.js           # Authentication routes
│       ├── seats.js          # Seat management routes
│       └── reservations.js   # Reservation routes
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main app component with routing
    │   ├── App.css           # Global styles
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── Dashboard/
    │   │   │   └── Dashboard.jsx
    │   │   ├── Admin/
    │   │   │   └── AdminDashboard.jsx
    │   │   ├── Layout/
    │   │   │   └── Navbar.jsx
    │   │   ├── Seats/
    │   │   │   └── SeatMap.jsx
    │   │   └── Reservations/
    │   │       └── ReservationHistory.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Authentication context
    │   └── services/
    │       └── api.js            # API service layer
    └── package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Seats

- `GET /api/seats` - Get all seats
- `POST /api/seats` - Create new seat (Admin only)
- `DELETE /api/seats/:id` - Delete seat (Admin only)

### Reservations

- `GET /api/reservations` - Get user's reservations
- `GET /api/reservations/all` - Get all reservations (Admin only)
- `POST /api/reservations` - Create reservation
- `DELETE /api/reservations/:id` - Cancel reservation

## Usage Guide

### For Interns

1. Register with role "intern" (default)
2. Login to access the dashboard
3. Navigate to "Seat Map" to view available seats
4. Click on green (available) seats to select and reserve
5. View your reservations in "My Reservations"

### For Admins

1. Register with role "admin"
2. Access additional "Admin Panel" from navigation
3. View system statistics and manage all seats
4. Add new seats or remove existing ones
5. View and manage all user reservations

## Default Test Data

You can create test users with different roles:

**Admin User:**

- Email: admin@test.com
- Password: admin123
- Role: admin

**Intern User:**

- Email: intern@test.com
- Password: intern123
- Role: intern

## Troubleshooting

### Common Issues

1. **Backend won't start**: Check MongoDB connection string in `.env`
2. **Frontend won't start**: Ensure Vite version compatibility with Node.js
3. **API calls failing**: Verify backend is running on port 5000
4. **Authentication issues**: Check JWT_SECRET in environment variables

### Version Compatibility

- This project uses Vite 5.4.10 for compatibility with Node.js v21.3.0
- For newer Node.js versions, you may upgrade Vite accordingly

## Development Notes

- The backend uses simplified middleware for development
- CORS is enabled for all origins in development
- JWT tokens are stored in localStorage
- The application includes comprehensive error handling
- All API endpoints include proper authentication checks

## Production Deployment

For production deployment:

1. Set NODE_ENV=production
2. Configure proper CORS origins
3. Use environment variables for all sensitive data
4. Set up proper logging and monitoring
5. Use HTTPS for all communications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. Seat-reservation-system
