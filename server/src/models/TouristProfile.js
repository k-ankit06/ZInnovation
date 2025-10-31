import mongoose from 'mongoose';

const groupMemberSchema = new mongoose.Schema(
  {
    memberId: String,
    fullName: String,
    touristType: String,
    passportNumber: String,
    aadhaarNumber: String,
    bloodGroup: String
  },
  { _id: false }
);

const touristProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },

    // No inline unique here (we add partial unique index below)
    touristId: { type: String },

    touristType: String,
    fullName: String,
    email: String,
    phone: String,
    country: String,
    passportNumber: String,
    aadhaarNumber: String,
    dateOfBirth: String,
    gender: String,
    nationality: String,
    address: String,

    emergencyContactName: String,
    emergencyContactPhone: String,
    emergencyContactRelation: String,

    hotelName: String,
    hotelAddress: String,
    checkInDate: String,
    checkOutDate: String,
    purposeOfVisit: String,

    bloodGroup: String,
    medicalConditions: String,
    allergies: String,
    travelInsurance: String,
    insuranceProvider: String,

    group: [groupMemberSchema],

    isRegistered: { type: Boolean, default: false },

    idHash: { type: String, index: true },
    canonicalPayload: mongoose.Schema.Types.Mixed,
    cardVersion: { type: Number, default: 1 }
  },
  { timestamps: true }
);

// Enforce uniqueness only when touristId exists
touristProfileSchema.index(
  { touristId: 1 },
  { unique: true, partialFilterExpression: { touristId: { $exists: true, $type: 'string' } } }
);

export default mongoose.model('TouristProfile', touristProfileSchema);