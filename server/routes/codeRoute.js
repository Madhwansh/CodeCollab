import express from "express";
import { execute } from "../controllers/codeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to execute code
router.post("/execute", requireAuth, execute);

export default router;
