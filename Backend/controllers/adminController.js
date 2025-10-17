const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");

const getPendingDoctors = async (req, res) => {
  const users = await User.find({
    role: "doctor",
    isApproved: false,
    isActive: true,
  });
  const doctorIds = users.map((u) => u._id);
  const doctors = await Doctor.find({ user: { $in: doctorIds } }).populate(
    "user"
  );
  res.json(doctors);
};

const approveDoctor = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== "doctor")
    return res.status(404).json({ message: "Not found" });
  user.isApproved = true;
  await user.save();
  res.json({ message: "Approved", user });
};

const rejectDoctor = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== "doctor")
    return res.status(404).json({ message: "Not found" });
  user.isActive = false;
  await user.save();
  res.json({ message: "Rejected", user });
};

const getStats = async (req, res) => {
  const totalPatients = await User.countDocuments({
    role: "patient",
    isActive: true,
  });
  const totalDoctors = await User.countDocuments({
    role: "doctor",
    isApproved: true,
    isActive: true,
  });
  const totalAppointments = await Appointment.countDocuments();
  const revenue = await Payment.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  res.json({
    totalPatients,
    totalDoctors,
    totalAppointments,
    totalRevenue: revenue[0]?.total || 0,
  });
};

const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patient", "firstName lastName email")
    .populate("doctor", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.json(appointments);
};

const getRevenue = async (req, res) => {
  const payments = await Payment.find({ status: "completed" })
    .populate("doctor", "firstName lastName")
    .populate("patient", "firstName lastName")
    .sort({ createdAt: -1 });
  res.json(payments);
};

const getAllDoctors = async (req, res) => {
  const users = await User.find({
    role: "doctor",
    isActive: true,
  });
  const doctorIds = users.map((u) => u._id);
  const doctors = await Doctor.find({ user: { $in: doctorIds } }).populate(
    "user"
  );
  res.json(doctors);
};

const getAllPatients = async (req, res) => {
  const users = await User.find({
    role: "patient",
    isActive: true,
  });
  const patientIds = users.map((u) => u._id);
  const patients = await Patient.find({ user: { $in: patientIds } }).populate(
    "user"
  );
  res.json(patients);
};

const deletePatient = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== "patient")
    return res.status(404).json({ message: "Patient not found" });
  // Find all appointments for this patient
  const appointments = await Appointment.find({ patient: req.params.id });
  const appointmentIds = appointments.map(a => a._id);
  // Delete payments for these appointments
  await Payment.deleteMany({ appointment: { $in: appointmentIds } });
  // Delete appointments
  await Appointment.deleteMany({ patient: req.params.id });
  // Delete patient profile
  await Patient.findOneAndDelete({ user: req.params.id });
  // Delete user
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Patient account deleted permanently" });
};

const deleteDoctor = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== "doctor")
    return res.status(404).json({ message: "Doctor not found" });
  // Find all appointments for this doctor
  const appointments = await Appointment.find({ doctor: req.params.id });
  const appointmentIds = appointments.map(a => a._id);
  // Delete payments for these appointments
  await Payment.deleteMany({ appointment: { $in: appointmentIds } });
  // Delete appointments
  await Appointment.deleteMany({ doctor: req.params.id });
  // Delete doctor profile
  await Doctor.findOneAndDelete({ user: req.params.id });
  // Delete user
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Doctor account deleted permanently" });
};

module.exports = {
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
};
