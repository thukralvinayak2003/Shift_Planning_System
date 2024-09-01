import { Schema, model } from "mongoose";

const AvailabilitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  timezone: { type: String, required: true },
  onshift: { type: Boolean, required: true, default: false },
});

AvailabilitySchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "-__v -password",
  });
});

export default model("Availability", AvailabilitySchema);
