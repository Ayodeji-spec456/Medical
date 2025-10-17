// controllers/paymentController.js
require("dotenv").config();
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn("STRIPE_SECRET_KEY not set, Stripe functionality disabled");
}
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");

// @desc    Create Stripe payment intent (Step 1 of payment flow)
// @route   POST /api/payments/create-intent
// @access  Private (Patient)
const createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body; // amount in cents (e.g., 5000 = $50.00)

    // Validate appointment belongs to user
    const appointment = await Appointment.findById(appointmentId);
    if (
      !appointment ||
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res
        .status(404)
        .json({ message: "Appointment not found or not yours" });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Appointment Fee',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
      metadata: { appointmentId: appointment._id.toString() },
    });

    res.json({
      sessionUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res
      .status(500)
      .json({ message: "Payment setup failed", error: error.message });
  }
};

// @desc    Confirm checkout session and update appointment
// @route   POST /api/payments/confirm-checkout
// @access  Private
const confirmCheckout = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const appointmentId = session.metadata.appointmentId;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Create payment record
    const payment = await Payment.create({
      appointment: appointment._id,
      patient: appointment.patient,
      doctor: appointment.doctor,
      amount: appointment.consultationFee,
      stripePaymentId: session.payment_intent,
      status: "completed",
    });

    // Update appointment status
    appointment.paymentStatus = "paid";
    appointment.status = "confirmed";
    appointment.paymentId = session.payment_intent;
    await appointment.save();

    // Optional: Send email confirmations
    const patient = await User.findById(appointment.patient);
    const doctor = await User.findById(appointment.doctor);
    if (patient && doctor) {
      await sendEmail(
        patient.email,
        "✅ Appointment Confirmed – MediBook",
        `Your appointment with Dr. ${doctor.firstName} ${
          doctor.lastName
        } on ${new Date(appointment.appointmentDate).toDateString()} at ${
          appointment.appointmentTime
        } is confirmed. Fee: $${(appointment.consultationFee / 100).toFixed(
          2
        )}.`
      );
      await sendEmail(
        doctor.email,
        "📅 New Appointment – MediBook",
        `You have a new appointment with ${patient.firstName} ${
          patient.lastName
        } on ${new Date(appointment.appointmentDate).toDateString()} at ${
          appointment.appointmentTime
        }.`
      );
    }

    res.json({ success: true, payment, appointment });
  } catch (error) {
    console.error("Checkout confirmation error:", error);
    res
      .status(500)
      .json({ message: "Confirmation failed", error: error.message });
  }
};

// @desc    Confirm payment and update appointment (Step 2)
// @route   POST /api/payments/confirm
// @access  Private (Patient)
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Create payment record
    const payment = await Payment.create({
      appointment: appointment._id,
      patient: appointment.patient,
      doctor: appointment.doctor,
      amount: appointment.consultationFee,
      stripePaymentId: paymentIntentId,
      status: "completed",
    });

    // Update appointment status
    appointment.paymentStatus = "paid";
    appointment.status = "confirmed";
    appointment.paymentId = paymentIntentId;
    await appointment.save();

    // Optional: Send email confirmations
    const patient = await User.findById(appointment.patient);
    const doctor = await User.findById(appointment.doctor);
    if (patient && doctor) {
      await sendEmail(
        patient.email,
        "✅ Appointment Confirmed – MediBook",
        `Your appointment with Dr. ${doctor.firstName} ${
          doctor.lastName
        } on ${new Date(appointment.appointmentDate).toDateString()} at ${
          appointment.appointmentTime
        } is confirmed. Fee: $${(appointment.consultationFee / 100).toFixed(
          2
        )}.`
      );
      await sendEmail(
        doctor.email,
        "📅 New Appointment – MediBook",
        `You have a new appointment with ${patient.firstName} ${
          patient.lastName
        } on ${new Date(appointment.appointmentDate).toDateString()} at ${
          appointment.appointmentTime
        }.`
      );
    }

    res.json({ success: true, payment, appointment });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res
      .status(500)
      .json({ message: "Payment confirmation failed", error: error.message });
  }
};

// @desc    Process refund (for cancelled appointments)
// @route   POST /api/payments/refund
// @access  Private (Admin or System)
const refundPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Find payment and associated appointment
    const payment = await Payment.findOne({ stripePaymentId: paymentIntentId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const appointment = await Appointment.findById(payment.appointment);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 🔒 Enforce 24-hour refund policy (as per project spec)
    const now = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);
    const [hours, minutes] = appointment.appointmentTime.split(":").map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const timeUntilAppointment = appointmentDate - now;
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

    if (timeUntilAppointment < twentyFourHoursInMs) {
      return res.status(400).json({
        message: "Refund not allowed within 24 hours of the appointment",
      });
    }

    // Process refund via Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    // Update payment and appointment status
    payment.status = "refunded";
    await payment.save();

    appointment.paymentStatus = "refunded";
    appointment.status = "cancelled";
    await appointment.save();

    res.json({ success: true, refund });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ message: "Refund failed", error: error.message });
  }
};

// @desc    Get user's payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "patient") {
      filter.patient = req.user._id;
    } else if (req.user.role === "doctor") {
      filter.doctor = req.user._id;
    }

    const payments = await Payment.find(filter)
      .populate("appointment")
      .populate("patient", "firstName lastName")
      .populate("doctor", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load payment history",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmCheckout,
  confirmPayment,
  refundPayment,
  getPaymentHistory,
};
