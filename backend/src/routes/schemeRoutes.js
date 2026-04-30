import express from "express";
import {
  getSchemes,
  getSchemeById,
  recommendSchemes,
  createScheme,
  updateScheme,
  deleteScheme
} from "../controllers/schemeController.js";
import { adminOnly, optionalAuth, protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getSchemes));
router.get("/:id", asyncHandler(getSchemeById));
router.post("/recommend", optionalAuth, asyncHandler(recommendSchemes));
router.post("/", protect, adminOnly, asyncHandler(createScheme));
router.put("/:id", protect, adminOnly, asyncHandler(updateScheme));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteScheme));

export default router;
