const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./config/connection");
const {
  register,
  login,
  userDetails,
} = require("./controllers/user.controller");
const {
  getAllCandidates,
  createCandidate,
  deleteCandidate,
  voteForCandidate,
  getCandidateById,
} = require("./controllers/candidate.controller");
const authenticate = require("./middlewares/auth");
const isAdmin = require("./middlewares/adminAuth");

const app = express();
const server = http.createServer(app);

dotenv.config();

// enhanced socketIo.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
connectDatabase();

// middlewares
app.use(cors());
app.use(express.json());

// API Routes

// Auth routes
app.post("/api/register", register);
app.post("/api/login", login);
app.get("/api/me", authenticate, userDetails);

// Candidate routes
app.get("/api/candidates", authenticate, getAllCandidates);
app.post("/api/candidates", authenticate, isAdmin, createCandidate);
app.get("/api/candidates/:id", authenticate, getCandidateById);
app.delete("/api/candidates/:id", authenticate, isAdmin, deleteCandidate);
app.post("/api/candidates/:id/vote", authenticate, voteForCandidate);
// socket io events
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});
