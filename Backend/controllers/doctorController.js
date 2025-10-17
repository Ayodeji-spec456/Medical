// backend/controllers/doctorController.js
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment"); // <--- add this

const completeDoctorProfile = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Doctors only" });
    }
    const doctorData = { ...req.body, user: req.user._id };
    let doctor = await Doctor.findOne({ user: req.user._id });
    if (doctor) {
      doctor = await Doctor.findByIdAndUpdate(doctor._id, doctorData, {
        new: true,
      });
    } else {
      doctor = await Doctor.create(doctorData);
    }
    res.json(doctor);
  } catch (error) {
    console.error("Complete doctor profile error:", error);
    res.status(500).json({ message: "Failed to save profile" });
  }
};

const getDoctors = async (req, res) => {
  try {
    const { specialty, city, state } = req.query;
    // Note: filtering by nested user fields requires aggregation or populate+filter;
    // keep simple: query doctor fields and then populate user
    let filter = {};
    if (specialty) filter.specialty = { $regex: specialty, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };
    if (state) filter.state = { $regex: state, $options: "i" };

    const doctors = await Doctor.find(filter).populate(
      "user",
      "firstName lastName email phone isApproved isActive"
    );

    // filter out unapproved/inactive users server-side
    const visible = doctors.filter(
      (d) => d.user && d.user.isApproved && d.user.isActive
    );

    res.json(visible);
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({ message: "Failed to load doctors" });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "firstName lastName email phone isApproved isActive"
    );
    if (!doctor || !doctor.user?.isApproved) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error("Get doctor by id error:", error);
    res.status(500).json({ message: "Failed to load doctor" });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Profile not found" });
    doctor.availability = req.body.availability;
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    console.error("Update availability error:", error);
    res.status(500).json({ message: "Failed to update availability" });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate("patient", "firstName lastName email phone")
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    console.error("Get doctor appointments error:", error);
    res.status(500).json({ message: "Failed to load appointments" });
  }
};

module.exports = {
  completeDoctorProfile,
  getDoctors,
  getDoctorById,
  updateAvailability,
  getDoctorAppointments,
};
