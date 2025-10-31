import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, lowercase: true, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['tourist', 'authority'], required: true },
  phone: { type: String, trim: true },
  designation: { type: String }
}, { timestamps: true });

userSchema.methods.toPublic = function() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone,
    designation: this.designation
  };
};

export default mongoose.model('User', userSchema);