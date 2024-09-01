import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// Function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("Bearer", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// Register user function
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });
  createSendToken(user, 201, res);
});

// Login user function
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    createSendToken(user, 200, res);
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("Bearer");
  res.status(200).json({ status: "success" });
});
