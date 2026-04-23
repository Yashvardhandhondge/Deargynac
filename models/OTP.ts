import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  phone?: string;
  email?: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    phone: { type: String },
    email: { type: String },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP =
  mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);
