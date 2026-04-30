import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    token: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

const PasswordResetToken = mongoose.model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetToken;
