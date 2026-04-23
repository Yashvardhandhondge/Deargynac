import { Types } from "mongoose";

// ── Enums ──

export type UserRole =
  | "patient"
  | "doctor"
  | "admin"
  | "coordinator"
  | "radiologist";

export type ConsultationStatus =
  | "pending"
  | "active"
  | "completed"
  | "escalated"
  | "cancelled";

export type ConsultationType = "async" | "video";

export type PaymentStatus = "pending" | "paid" | "refunded";

export type MedicineFrequency = "OD" | "BD" | "TDS" | "QID" | "SOS" | "HS";

export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no-show";

export type DoctorSpecialty = "gynecologist" | "radiologist" | "surgeon";

export type ConditionType =
  | "pcos"
  | "periods"
  | "uti"
  | "discharge"
  | "pain"
  | "pregnancy"
  | "other";

// ── Interfaces ──

export interface IAvailableSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  role: UserRole;
  alias?: string;
  isAnonymous: boolean;
  isVerified: boolean;
  specialty?: DoctorSpecialty;
  experience?: number;
  mrnNumber?: string;
  bio?: string;
  rating: number;
  isActive: boolean;
  availableSlots: IAvailableSlot[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOTP {
  _id: Types.ObjectId;
  phone?: string;
  email?: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  senderId: Types.ObjectId;
  senderRole: string;
  content: string;
  attachments: string[];
  readAt?: Date;
  createdAt: Date;
}

export interface IConsultation {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId?: Types.ObjectId;
  status: ConsultationStatus;
  type: ConsultationType;
  condition?: ConditionType;
  intakeForm?: Record<string, unknown>;
  messages: IMessage[];
  prescription?: Types.ObjectId;
  amount?: number;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  responseDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedicine {
  name: string;
  dosage: string;
  frequency?: MedicineFrequency;
  duration?: string;
  instructions?: string;
}

export interface IPrescription {
  _id: Types.ObjectId;
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

export interface IAppointment {
  _id: Types.ObjectId;
  consultationId?: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  scheduledAt: Date;
  duration: number;
  type: ConsultationType;
  status: AppointmentStatus;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── API Response Types ──

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
