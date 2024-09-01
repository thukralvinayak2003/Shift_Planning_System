import { Schema, model } from "mongoose";

const ShiftSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  adminTimezone: { type: String, required: true },
  employeeTimezone: { type: String, required: true },
});

export default model("Shift", ShiftSchema);
