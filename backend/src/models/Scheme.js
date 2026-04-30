import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    schemeName: {
      type: String,
      required: true,
      trim: true
    },
    ministry: {
      type: String,
      required: true,
      trim: true
    },
    lifeEvent: {
      type: String,
      required: true,
      enum: ["Education", "Employment", "Marriage", "Business", "Pregnancy", "Retirement"]
    },
    eligibility: [
      {
        label: { type: String, required: true },
        type: { type: String, default: "text" },
        value: { type: String, required: true }
      }
    ],
    benefitDetails: {
      type: String,
      required: true
    },
    benefitType: {
      type: String,
      required: true
    },
    officialUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active"
    }
  },
  { timestamps: true }
);

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme;
