const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialty: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    experience: { type: Number, required: true },
    consultationFee: { type: Number, required: true },
    address: String,
    city: String,
    state: String,
    bio: String,
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true },
      },
    ],
    rating: { type: Number, default: 0 },
    totalAppointments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
