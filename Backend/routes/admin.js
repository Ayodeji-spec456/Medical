const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getStats,
  getAllAppointments,
  getRevenue,
  getAllDoctors,
  getAllPatients,
  deletePatient,
  deleteDoctor,
} = require("../controllers/adminController");
const router = express.Router();
router.get("/doctors/pending", protect, authorize("admin"), getPendingDoctors);
router.put("/doctors/:id/approve", protect, authorize("admin"), approveDoctor);
router.put("/doctors/:id/reject", protect, authorize("admin"), rejectDoctor);
router.get("/stats", protect, authorize("admin"), getStats);
router.get("/appointments", protect, authorize("admin"), getAllAppointments);
router.get("/revenue", protect, authorize("admin"), getRevenue);
router.get("/doctors/all", protect, authorize("admin"), getAllDoctors);
router.delete("/doctors/:id/delete", protect, authorize("admin"), deleteDoctor);
router.get("/patients/all", protect, authorize("admin"), getAllPatients);
router.delete("/patients/:id/delete", protect, authorize("admin"), deletePatient);
module.exports = router;
