import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    touristId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    alertType: { type: String, default: 'Safety Warning' },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' },
    isRead: { type: Boolean, default: false },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Alert', alertSchema);
