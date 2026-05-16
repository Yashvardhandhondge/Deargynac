import mongoose, { Schema, Document } from "mongoose";

export interface IAvailableSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IUser extends Document {
  name: string;
  /** Unique login id for registered (non-anonymous) accounts */
  username?: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  role: "patient" | "doctor" | "admin" | "coordinator" | "radiologist";
  alias?: string;
  isAnonymous: boolean;
  isVerified: boolean;
  specialty?: "gynecologist" | "radiologist" | "surgeon";
  experience?: number;
  mrnNumber?: string;
  bio?: string;
  rating: number;
  isActive: boolean;
  availableSlots: IAvailableSlot[];
  createdAt: Date;
  updatedAt: Date;
}

const AvailableSlotSchema = new Schema(
  {
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, sparse: true, unique: true, lowercase: true, trim: true },
    email: { type: String, sparse: true, unique: true },
    phone: { type: String, sparse: true, unique: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin", "coordinator", "radiologist"],
      default: "patient",
    },
    alias: { type: String },
    isAnonymous: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    specialty: {
      type: String,
      enum: ["gynecologist", "radiologist", "surgeon"],
    },
    experience: { type: Number },
    mrnNumber: { type: String },
    bio: { type: String },
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    availableSlots: [AvailableSlotSchema],
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
