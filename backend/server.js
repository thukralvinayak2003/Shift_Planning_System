import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

const app = express();

// Middleware
app.use(express.json());
dotenv.config({ path: "./.env" }); // Adjusted path if necessary
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

const limiter = rateLimit({
  max: 100,
  windowMS: 6 * 60 * 1000,
  message: "Too many requests from this IP. Please try again later",
});

app.use("/api", limiter);
app.use(mongoSanitize());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

//Error handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Database Connection
connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
