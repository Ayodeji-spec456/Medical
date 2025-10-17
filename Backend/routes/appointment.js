const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const {
  bookAppointment,
  getPatientAppointments,
  proposeAppointment,
  acceptAppointment,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointmentController");
const router = express.Router();
router.post("/", protect, authorize("patient"), bookAppointment);
router.post("/propose", protect, authorize("doctor"), proposeAppointment);
router.get("/patient", protect, authorize("patient"), getPatientAppointments);
router.put("/:id/accept", protect, authorize("patient"), acceptAppointment);
router.put("/:id/status", protect, updateAppointmentStatus);
router.delete("/:id", protect, authorize("patient"), cancelAppointment);
module.exports = router;
