// // routes/availabilityRoutes.js
// import { Router } from "express";
// import {
//   createAvailability,
//   getAvailabilityByUser,
// } from "../controller/availabilityController.js";
// import { protect, authorize } from "../middleware/authMiddleware.js";

// const router = Router();

// router
//   .route("/shifts/")
//   .post(protect, authorize("Employee"), createAvailability);
// router.route("/").get(protect, authorize("Admin"), getAvailabilityByUser);

// export default router;
