import express from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
