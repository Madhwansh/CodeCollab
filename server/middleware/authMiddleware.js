// authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * Middleware to protect private routes by verifying JWT from cookie.
 */
export const requireAuth = (req, res, next) => {
  // Get token from cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token missing",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
