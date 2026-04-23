import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMedicine {
  name: string;
  dosage: string;
  frequency?: "OD" | "BD" | "TDS" | "QID" | "SOS" | "HS";
  duration?: string;
  instructions?: string;
}

export interface IPrescription extends Document {
  consultationId: Types.ObjectId;
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  medicines: IMedicine[];
  notes?: string;
  followUpDate?: Date;
  pdfUrl?: string;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: {
      type: String,
      enum: ["OD", "BD", "TDS", "QID", "SOS", "HS"],
    },
    duration: { type: String },
    instructions: { type: String },
  },
  { _id: false }
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    consultationId: {
      type: Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicines: [MedicineSchema],
    notes: { type: String },
    followUpDate: { type: Date },
    pdfUrl: { type: String },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Prescription =
  mongoose.models.Prescription ||
  mongoose.model<IPrescription>("Prescription", PrescriptionSchema);
