import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  refId: { type: String, index: true },

  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // UI-friendly type strings
  type: { type: String, trim: true },

  severity: { type: String, enum: ['Critical','High','Medium','Low'], default: 'Medium' },

  status: { type: String, enum: ['open','assigned','resolved','in-progress'], default: 'open', index: true },

  // Fields your UI uses
  touristName: String,
  locationText: String,
  occurredAt: Date,
  description: String,
  responseTeam: String,
  officer: String,

  // Optional structured coords
  location: { lat: Number, lng: Number },

  assignedTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  etaMinutes: Number,
  notes: String,

  timeline: [{ t: Date, event: String }]
}, { timestamps: true });

export default mongoose.model('Incident', incidentSchema);