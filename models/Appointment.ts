import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  consultationId?: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  scheduledAt: Date;
  duration: number;
  type: "async" | "video";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    consultationId: { type: Schema.Types.ObjectId, ref: "Consultation" },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 15 },
    type: {
      type: String,
      enum: ["async", "video"],
      default: "async",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
