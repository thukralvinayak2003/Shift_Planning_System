// controllers/availabilityController.js
import Availability from "../models/Availability.js";
import asyncHandler from "express-async-handler";

export const createAvailability = asyncHandler(async (req, res) => {
  const { date, startTime, endTime, timezone } = req.body;

  const all = await Availability.findOne({ date: date });

  if (all) {
    return res.status(404).json({ message: "User availability already exist" });
  }

  const availability = await Availability.create({
    user: req.user._id,
    date,
    startTime,
    endTime,
    timezone,
  });

  res.status(201).json(availability);
});

export const getAvailabilityByUser = asyncHandler(async (req, res) => {
  const availability = await Availability.find({ user: req.user._id });
  res.status(200).json(availability);
});

export const getAllAvailability = asyncHandler(async (req, res) => {
  const availability = await Availability.find({ onshift: false });
  res.status(200).json(availability);
});
