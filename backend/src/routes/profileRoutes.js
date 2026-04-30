import express from "express";
import {
  getProfile,
  updateProfile,
  saveScheme
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", protect, asyncHandler(getProfile));
router.put("/update", protect, upload.single("profilePicture"), asyncHandler(updateProfile));
router.post("/save-scheme", protect, asyncHandler(saveScheme));

export default router;
