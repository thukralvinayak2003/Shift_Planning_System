import { getAllAvailability } from "../controller/availabilityController.js";
import { createShift } from "../controller/shiftController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.route("/shifts").post(protect, authorize("Admin"), createShift);
router
  .route("/availability")
  .get(protect, authorize("Admin"), getAllAvailability);

export default router;
