import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, asyncHandler(getAdminStats));

export default router;
