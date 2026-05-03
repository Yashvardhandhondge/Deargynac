import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage {
  senderId: Types.ObjectId;
  senderRole: string;
  content: string;
  attachments: string[];
  readAt?: Date;
  createdAt: Date;
}

export interface IConsultation extends Document {
  patientId: Types.ObjectId;
  doctorId?: Types.ObjectId;
  status: "pending" | "active" | "completed" | "escalated" | "cancelled";
  type: "async" | "video";
  condition?:
    | "pcos"
    | "periods"
    | "uti"
    | "discharge"
    | "pain"
    | "pregnancy"
    | "diagnostics"
    | "other";
  intakeForm?: Record<string, unknown>;
  messages: IMessage[];
  prescription?: Types.ObjectId;
  amount?: number;
  paymentStatus: "pending" | "paid" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  responseDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    senderRole: { type: String },
    content: { type: String },
    attachments: [{ type: String }],
    readAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ConsultationSchema = new Schema<IConsultation>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "escalated", "cancelled"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["async", "video"],
      default: "async",
    },
    condition: {
      type: String,
      enum: [
        "pcos",
        "periods",
        "uti",
        "discharge",
        "pain",
        "pregnancy",
        "diagnostics",
        "other",
      ],
    },
    intakeForm: { type: Schema.Types.Mixed },
    messages: [MessageSchema],
    prescription: { type: Schema.Types.ObjectId, ref: "Prescription" },
    amount: { type: Number },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    responseDeadline: { type: Date },
  },
  { timestamps: true }
);

export const Consultation =
  mongoose.models.Consultation ||
  mongoose.model<IConsultation>("Consultation", ConsultationSchema);
