// server/routes/collabRoute.js
import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createRoom, joinRoom } from "../controllers/collabController.js";

const router = express.Router();

// protect both endpoints
router.post("/create", requireAuth, createRoom);
router.post("/join", requireAuth, joinRoom);

export default router;
