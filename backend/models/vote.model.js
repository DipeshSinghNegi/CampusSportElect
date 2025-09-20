
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  sportCategory: {
    type: String,
    enum: [
      "Volleyball Secretary Boys",
      "Volleyball Secretary Girls",
      "Cricket Secretary",
      "Indoor Games Secretary",
      "Overall Sports Secretary"
    ],
    required: true
  },
  photo: { type: String, default: "https://via.placeholder.com/300x200?text=Candidate+Photo" },
  votes: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
