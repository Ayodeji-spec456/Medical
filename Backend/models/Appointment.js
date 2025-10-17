const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  duration: { type: Number, default: 30 },
  consultationFee: { type: Number, required: true },
  status: {
    type: String,
    enum: ["proposed", "pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  paymentId: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
