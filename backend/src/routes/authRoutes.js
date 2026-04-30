import express from "express";
import {
  signup,
  login,
  googleAuth,
  verifyOtp,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/signup", upload.single("profilePicture"), asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.post("/google", asyncHandler(googleAuth));
router.post("/verify-otp", asyncHandler(verifyOtp));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password", asyncHandler(resetPassword));

export default router;
