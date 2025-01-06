import mongoose, { Schema, Document, Model } from "mongoose";

interface CertificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  qualification: string;
  certifications: string[];
  experience: string;
  applicationStatus: "pending" | "accepted" | "rejected";
  rejectedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema: Schema<CertificationDocument> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    qualification: { type: String, required: true },
    certifications: [{ type: String }], // List of professional certifications(pdf)
    experience: { type: String, required: true },
    applicationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    rejectedReason: { type: String, default: null },
  },
  { timestamps: true }
);

export const CertificationModel: Model<CertificationDocument> = mongoose.model<CertificationDocument>(
  "Certification",
  CertificationSchema
);
