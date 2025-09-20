# Voting App Frontend

A modern React frontend for the Voting App, built with Vite, React Router, Axios, and TailwindCSS.

## Features

- **Authentication**: Login and Register with JWT token management
- **Protected Routes**: Secure access to dashboard and poll pages
- **Dashboard**: View all available polls with voting capabilities
- **Create Polls**: Admin-only functionality to create new poll options
- **Poll Details**: Detailed view with voting form and interactive charts
- **Real-time Updates**: Live voting results with beautiful visualizations
- **Responsive Design**: Clean, modern UI that works on all devices

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Beautiful charts and visualizations
- **Socket.IO Client** - Real-time communication

## Setup Instructions

### Prerequisites

Make sure you have Node.js (v16 or higher) and npm installed on your system.

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

The frontend is configured to work with the backend API running on `http://localhost:3001`. The Vite dev server includes a proxy configuration to handle API requests.

### Available API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/me` - Get current user details
- `GET /api/votes` - Get all polls
- `POST /api/votes` - Create new poll (admin only)
- `POST /api/vote/:id` - Vote for a poll option
- `DELETE /api/vote/:id` - Delete a poll (admin only)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   └── ProtectedRoute.jsx # Route protection wrapper
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Polls dashboard
│   ├── CreatePoll.jsx  # Create poll page
│   └── PollDetails.jsx # Poll details with charts
├── services/           # API services
│   └── api.js          # Axios configuration and API calls
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Authentication Flow

1. **Registration/Login**: Users can create accounts or sign in
2. **JWT Storage**: Tokens are stored in localStorage
3. **Auto-attach**: Axios automatically includes JWT in API requests
4. **Route Protection**: Protected routes redirect unauthenticated users
5. **Token Refresh**: Automatic logout on token expiration

## User Roles

- **User**: Can view polls and vote (once per poll)
- **Admin**: Can create and delete polls, plus all user permissions

## Voting System

- Users can only vote once across all polls
- Real-time vote counting and updates
- Interactive charts showing vote distribution
- Admin controls for poll management

## Development

The app uses Vite for fast development with hot module replacement. The proxy configuration allows seamless API integration during development.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the frontend directory if you need to customize the API URL:

```
VITE_API_URL=http://localhost:3001/api
```

## Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Add proper error handling
4. Test all user flows
5. Ensure responsive design

## License

This project is part of the Voting App system.
