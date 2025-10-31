import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['Medical','Police','Patrol','Support'] },
  members: Number,
  status: { type: String, enum: ['Available','On Duty'], default: 'Available' },
  location: String,
  currentAssignment: String,
  avgResponseMins: Number,
  completedToday: { type: Number, default: 0 },
  contact: String
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);