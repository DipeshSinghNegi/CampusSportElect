const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  sportCategory: { type: String, required: true },
  photo: { type: String },
  votes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Candidate', candidateSchema);
