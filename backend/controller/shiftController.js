import Shift from "../models/Shift.js";
import Availability from "../models/Availability.js";
import asyncHandler from "express-async-handler";
import moment from "moment-timezone";

// Create Shift
export const createShift = asyncHandler(async (req, res) => {
  const { employeeId, date, startTime, endTime, adminTimezone } = req.body;

  // Fetch the user's availability and set `onshift` to true

  const availability = await Availability.findOneAndUpdate(
    { user: employeeId, date: date, onshift: false },
    { onshift: true }
  );

  if (!availability) {
    return res.status(404).json({ message: "User availability not found" });
  }

  // Convert employee's availability to admin's timezone
  const employeeStartTime = moment.tz(
    `${date}T${availability.startTime}:00`,
    availability.timezone
  );
  const employeeEndTime = moment.tz(
    `${date}T${availability.endTime}:00`,
    availability.timezone
  );

  const adminStartTime = employeeStartTime.clone().tz(adminTimezone);
  const adminEndTime = employeeEndTime.clone().tz(adminTimezone);

  // Check if admin's selected time falls within the employee's availability range
  const selectedShiftStart = moment.tz(
    `${date}T${startTime}:00`,
    adminTimezone
  );
  const selectedShiftEnd = moment.tz(`${date}T${endTime}:00`, adminTimezone);

  if (
    selectedShiftStart.isBefore(adminStartTime) ||
    selectedShiftEnd.isAfter(adminEndTime)
  ) {
    return res.status(400).json({
      message: "Selected time range is outside of employee's availability",
    });
  }

  // Create the shift
  const shift = await Shift.create({
    user: employeeId,
    date,
    startTime: selectedShiftStart.format("HH:mm"),
    endTime: selectedShiftEnd.format("HH:mm"),
    adminTimezone: adminTimezone,
    employeeTimezone: availability.timezone,
  });

  res.status(201).json(shift);
});

// Get Shifts for Employee
const formatTime = (date, timezone) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(date);
};

export const getShiftsForEmployee = asyncHandler(async (req, res) => {
  const shifts = await Shift.find({ user: req.user });
  const shiftsWithEmployeeTimezone = shifts.map((shift) => {
    const shiftDate = new Date(shift.date);
    const startDateTime = new Date(
      `${shiftDate.toISOString().split("T")[0]}T${shift.startTime}:00.000Z`
    );
    const endDateTime = new Date(
      `${shiftDate.toISOString().split("T")[0]}T${shift.endTime}:00.000Z`
    );

    const employeeShiftStartTime = formatTime(
      startDateTime,
      shift.employeeTimezone
    );
    const employeeShiftEndTime = formatTime(
      endDateTime,
      shift.employeeTimezone
    );

    return {
      ...shift._doc,
      startTimeInEmployeeTimezone: employeeShiftStartTime,
      endTimeInEmployeeTimezone: employeeShiftEndTime,
    };
  });

  res.status(200).json(shiftsWithEmployeeTimezone);
});
