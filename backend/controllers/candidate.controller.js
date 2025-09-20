const Candidate = require("../models/vote.model");
const User = require("../models/user.model");

// Get all candidates
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate("createdBy", "username email");
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new candidate (admin only)
const createCandidate = async (req, res) => {
  try {
    const { name, gender, sportCategory, photo } = req.body;
    if (!name || !gender || !sportCategory) {
      return res.status(400).json({ error: "Name, gender, and sport category are required" });
    }
    const candidate = await Candidate.create({
      name,
      gender,
      sportCategory,
      photo: photo || "https://via.placeholder.com/300x200?text=Candidate+Photo",
      createdBy: req.user._id,
    });
    const populatedCandidate = await Candidate.findById(candidate._id).populate("createdBy", "username email");
    res.status(201).json(populatedCandidate);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Candidate already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Delete candidate (admin only)
const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    // Remove votes for this candidate from all users
    await User.updateMany(
      { "votedCategories.candidate": id },
      { $pull: { votedCategories: { candidate: id } } }
    );
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vote for candidate
const voteForCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    // Check if candidate exists
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    // Check if user already voted for this category and gender
    const user = await User.findById(userId);
    const alreadyVoted = user.votedCategories.some(
      vote => vote.category === candidate.sportCategory && vote.gender === candidate.gender
    );
    if (alreadyVoted) {
      return res.status(400).json({ error: `You have already voted for ${candidate.sportCategory} (${candidate.gender})` });
    }
    // Add vote to candidate
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      { new: true }
    );
    // Add vote to user's voted categories
    await User.findByIdAndUpdate(
      userId,
      { $push: { votedCategories: { category: candidate.sportCategory, gender: candidate.gender, candidate: id } } }
    );
    res.status(200).json({ 
      candidate: updatedCandidate,
      message: "Vote cast successfully" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get candidate by ID
const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id).populate("createdBy", "username email");
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCandidates,
  createCandidate,
  deleteCandidate,
  voteForCandidate,
  getCandidateById,
};
