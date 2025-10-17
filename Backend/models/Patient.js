const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: String,
    city: String,
    state: String,
    emergencyContact: String,
    emergencyPhone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
