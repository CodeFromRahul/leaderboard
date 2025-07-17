import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  pointsClaimed: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('History', historySchema);
