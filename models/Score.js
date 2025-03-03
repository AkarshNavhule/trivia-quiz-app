// models/Score.js

import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhoto: { type: String },
  scorePercentage: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Score || mongoose.model('Score', ScoreSchema);
