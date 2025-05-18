import express from "express";
import {
  register,
  login,
  googleAuth,
  googleAuthCallback,
  logout,
  checkAuth,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Local Authentication
router.post("/register", register);
router.post("/login", login);

// Google OAuth
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

// Logout
router.post("/logout", logout);

// Middleware to protect private routes
router.get("/user-auth", requireAuth, checkAuth);

export default router;
