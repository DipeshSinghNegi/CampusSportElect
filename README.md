# CampusSportElect

An online sports election system for college sports secretary elections. Built with React, Vite, Tailwind CSS, Node.js (Express), and MongoDB.

## Features

- **Role-Based Dashboards**: Separate admin and user dashboards for candidate management and voting.
- **Category-Based Voting**: Students can vote for one boy and one girl per sports category.
- **Secure Authentication**: JWT-based login and registration for users and admins.
- **Candidate Management**: Admins can add, delete, and view candidates grouped by category and gender.
- **Real-Time Results**: Instant updates of votes and results on the dashboard.
- **RESTful APIs**: Backend exposes endpoints for authentication, candidate management, and voting.
- **Optimized MongoDB Schemas**: Efficient data models for users, candidates, and votes.
- **Responsive UI**: Modern, mobile-friendly design using Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js (Express)
- **Database**: MongoDB (Mongoose)

## Project Structure

```
voting/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── config/
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── ...
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DipeshSinghNegi/CampusSportElect.git
   cd CampusSportElect/voting
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Configure MongoDB connection in config/connection.js
   npm run seed   # Seed demo candidates
   npm start      # Start backend server (default: http://localhost:3001)
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev    # Start frontend (default: http://localhost:3000)
   ```

## Usage

- **Admin:** Login to access candidate management dashboard. Add/delete candidates, view votes grouped by category/gender.
- **Student:** Login to vote for one boy and one girl per category. View real-time results and voting summary.

## API Overview

- `POST /api/register` — Register user
- `POST /api/login` — Login user/admin
- `GET /api/candidates` — List all candidates
- `POST /api/candidates` — Add candidate (admin)
- `DELETE /api/candidates/:id` — Delete candidate (admin)
- `POST /api/candidates/:id/vote` — Vote for candidate
- `GET /api/results` — Get voting results

## Data Models

- **User**: username, password, role (admin/user), votedCategories (category, gender, candidate)
- **Candidate**: name, photo, sportCategory, gender, votes
- **Vote**: (tracked in User.votedCategories)

## License

MIT

---

For demo links, screenshots, or more details, see the frontend and backend README files or contact the repo owner.
