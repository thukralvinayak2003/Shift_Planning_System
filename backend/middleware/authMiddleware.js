// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies.Bearer) {
    token = req.cookies.Bearer;
    const decode = jwt.verify(req.cookies.Bearer, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id).select("-password");
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
  next();
});

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "User role not authorized" });
    }
    next();
  };
}
