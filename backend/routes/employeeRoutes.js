import { Router } from "express";
import {
  createAvailability,
  getAvailabilityByUser,
} from "../controller/availabilityController.js";
import { getShiftsForEmployee } from "../controller/shiftController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router
  .route("/availability")
  .post(protect, authorize("Employee"), createAvailability);

router
  .route("/shifts")
  .get(protect, authorize("Employee"), getShiftsForEmployee);

router
  .route("/availability")
  .get(protect, authorize("Employee"), getAvailabilityByUser);

export default router;
