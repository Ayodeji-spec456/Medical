// backend/controllers/appointmentController.js
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const { sendEmail } = require("../services/emailService");

// Book an appointment (patient)
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, consultationFee } =
      req.body;

    const doctorUser = await User.findById(doctorId);
    if (!doctorUser || doctorUser.role !== "doctor" || !doctorUser.isApproved) {
      return res.status(400).json({ message: "Invalid doctor" });
    }

    const doctor = await Doctor.findOne({ user: doctorId });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }

    const appointmentDateObj = new Date(appointmentDate);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = daysOfWeek[appointmentDateObj.getDay()];
    const avail = doctor.availability.find(a => a.day === day);
    if (!avail || !avail.isAvailable) {
      return res.status(400).json({ message: "Doctor not available on this day" });
    }
    if (appointmentTime < avail.startTime || appointmentTime >= avail.endTime) {
      return res.status(400).json({ message: "Doctor not available at this time" });
    }

    const existing = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $ne: "cancelled" },
    });

    if (existing) return res.status(400).json({ message: "Slot booked" });

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      consultationFee,
      status: "pending",
      paymentStatus: "pending",
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Book appointment error:", error);
    res.status(500).json({ message: "Failed to book", error: error.message });
  }
};

// Get patient appointments
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "firstName lastName")
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    console.error("Get patient appointments error:", error);
    res.status(500).json({ message: "Failed to load appointments" });
  }
};

// Propose an appointment (doctor)
const proposeAppointment = async (req, res) => {
  try {
    const { patientId, appointmentDate, appointmentTime, consultationFee } = req.body;

    const patientUser = await User.findById(patientId);
    if (!patientUser || patientUser.role !== "patient") {
      return res.status(400).json({ message: "Invalid patient" });
    }

    const existing = await Appointment.findOne({
      doctor: req.user._id,
      patient: patientId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $ne: "cancelled" },
    });

    if (existing) return res.status(400).json({ message: "Slot already proposed or booked" });

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: req.user._id,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      consultationFee,
      status: "proposed",
      paymentStatus: "pending",
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Propose appointment error:", error);
    res.status(500).json({ message: "Failed to propose", error: error.message });
  }
};

// Accept proposed appointment (patient)
const acceptAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || appointment.patient.toString() !== req.user._id.toString() || appointment.status !== "proposed") {
      return res.status(403).json({ message: "Not authorized or not proposed" });
    }
    appointment.status = "pending";
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error("Accept appointment error:", error);
    res.status(500).json({ message: "Failed to accept" });
  }
};

// Update appointment status (doctor confirms/completes, patient cancels)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Not found" });

    if (
      status === "cancelled" &&
      req.user._id.toString() !== appointment.patient.toString()
    ) {
      return res.status(403).json({ message: "Only patient can cancel" });
    }

    if (
      ["confirmed", "completed"].includes(status) &&
      req.user._id.toString() !== appointment.doctor.toString()
    ) {
      return res.status(403).json({ message: "Only doctor can confirm" });
    }

    appointment.status = status;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error("Update appointment status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Cancel appointment (patient)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (
      !appointment ||
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    appointment.status = "cancelled";
    await appointment.save();
    res.json({ message: "Cancelled", appointment });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({ message: "Failed to cancel" });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  proposeAppointment,
  acceptAppointment,
  updateAppointmentStatus,
  cancelAppointment,
};
