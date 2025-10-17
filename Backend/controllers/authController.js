// backend/controllers/authController.js
const User = require("../models/User");
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Allow patients, admins, and doctors to self-register
    const allowedRoles = ["patient", "admin", "doctor"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid registration role" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || "patient",
      isApproved: role === 'doctor' ? false : true,
    });

    if (user) {
      // Create Patient document for patients
      if (user.role === "patient") {
        await Patient.create({ user: user._id });
      }

      return res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user._id, user.role),
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.role === "doctor" && !user.isApproved) {
        return res.status(403).json({ message: "Doctor not approved" });
      }
      return res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user._id, user.role),
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  // protect middleware should already have populated req.user
  res.json({
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    role: req.user.role,
    isApproved: req.user.isApproved,
  });
};

module.exports = { registerUser, loginUser, getUserProfile };
