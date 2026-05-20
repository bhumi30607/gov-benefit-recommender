import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import OtpVerification from "../models/OtpVerification.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import generateToken from "../utils/generateToken.js";
import { generateOtp, generateResetToken } from "../utils/otp.js";
import { sendEmail } from "../utils/sendEmail.js";

const buildProfilePictureUrl = (req, file) => {
  if (!file) {
    return "";
  }

  return `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${file.filename}`;
};

const getGoogleClient = () => new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  age: user.age,
  income: user.income,
  occupation: user.occupation,
  gender: user.gender,
  dateOfBirth: user.dateOfBirth,
  phone: user.phone,
  state: user.state,
  profilePicture: user.profilePicture,
  savedSchemes: user.savedSchemes,
  accountType: user.accountType,
  isVerified: user.isVerified
});

export const signup = async (req, res) => {
  const { name, email, password, age, income, occupation } = req.body;

  if (!name || !email || !password || !age || !income || !occupation) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const profilePicture = buildProfilePictureUrl(req, req.file);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    age,
    income,
    occupation,
    profilePicture,
    isVerified: false
  });

  const otp = generateOtp();
  await OtpVerification.deleteMany({ email });
  await OtpVerification.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  await sendEmail({
    to: email,
    subject: "Verify your account",
    html: `<p>Your OTP for account verification is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
  });

  res.status(201).json({
    message: "Signup successful. Verify OTP to activate your account.",
    user: sanitizeUser(user)
  });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const otpRecord = await OtpVerification.findOne({ email, otp });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
  await OtpVerification.deleteMany({ email });

  res.json({
    message: "Account verified successfully",
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("savedSchemes");

  if (!user || !user.password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ message: "Please verify your email first" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

export const googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }

  const ticket = await getGoogleClient().verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  let user = await User.findOne({ email: payload.email }).populate("savedSchemes");

  if (!user) {
    user = await User.create({
      name: payload.name || "Google User",
      email: payload.email,
      googleId: payload.sub,
      profilePicture: payload.picture || "",
      age: Number(req.body.age || 18),
      income: Number(req.body.income || 0),
      occupation: req.body.occupation || "Not specified",
      isVerified: true
    });
  }

  res.json({
    message: "Google login successful",
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "If the account exists, a reset email has been sent" });
  }

  const resetToken = generateResetToken();
  await PasswordResetToken.deleteMany({ email });
  await PasswordResetToken.create({
    email,
    token: resetToken,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000)
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;
  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>Reset your password using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });

  res.json({ message: "Password reset email sent" });
};

export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  const resetToken = await PasswordResetToken.findOne({ email, token });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });
  await PasswordResetToken.deleteMany({ email });

  res.json({ message: "Password reset successful" });
};
