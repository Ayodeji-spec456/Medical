const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const {
  completeDoctorProfile,
  getDoctors,
  getDoctorById,
  updateAvailability,
  getDoctorAppointments,
} = require("../controllers/doctorController");
const router = express.Router();
router.post("/profile", protect, authorize("doctor"), completeDoctorProfile);
router.put("/availability", protect, authorize("doctor"), updateAvailability);
router.get(
  "/appointments",
  protect,
  authorize("doctor"),
  getDoctorAppointments
);
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
module.exports = router;
