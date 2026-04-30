import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String
    },
    profilePicture: {
      type: String,
      default: ""
    },
    googleId: {
      type: String,
      default: ""
    },
    age: {
      type: Number,
      required: true
    },
    income: {
      type: Number,
      required: true
    },
    occupation: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      default: ""
    },
    dateOfBirth: {
      type: Date
    },
    phone: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    savedSchemes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scheme"
      }
    ],
    accountType: {
      type: String,
      enum: ["User", "Admin"],
      default: "User"
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
