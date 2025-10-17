import React, { useState } from "react";
import { toast } from "react-toastify";
import { appointmentService } from "../../services/appointmentService";
import StripePayment from "../payment/StripePayment";
import { formatDate, formatTime, formatCurrency } from "../../utils/helpers";
import { TIME_SLOTS } from "../../utils/constants";
import "../../styles/booking.css";

const BookingModal = ({ doctor, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDaysInMonth = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (step === 1 && !selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (step === 2 && !selectedTime) {
      toast.error("Please select a time slot");
      return;
    }
    if (step === 2) {
      createAppointment();
    } else {
      setStep(step + 1);
    }
  };

  const createAppointment = async () => {
    setLoading(true);
    try {
      const appointmentData = {
        doctorId: doctor.user._id,
        appointmentDate: selectedDate.toISOString().split("T")[0],
        appointmentTime: selectedTime,
        consultationFee: doctor.consultationFee,
      };
      const newAppointment = await appointmentService.bookAppointment(
        appointmentData
      );
      setAppointment(newAppointment);
      setStep(3);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep(4);
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  return (
    <div className="booking-modal" onClick={onClose}>
      <div
        className="booking-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="booking-modal-header">
          <h2>Book Appointment</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="booking-modal-body">
          {/* Steps Indicator */}
          <div className="booking-steps">
            <div
              className={`booking-step ${step >= 1 ? "active" : ""} ${
                step > 1 ? "completed" : ""
              }`}
            >
              <div className="step-number">1</div>
              <div className="step-label">Select Date</div>
            </div>
            <div
              className={`booking-step ${step >= 2 ? "active" : ""} ${
                step > 2 ? "completed" : ""
              }`}
            >
              <div className="step-number">2</div>
              <div className="step-label">Select Time</div>
            </div>
            <div
              className={`booking-step ${step >= 3 ? "active" : ""} ${
                step > 3 ? "completed" : ""
              }`}
            >
              <div className="step-number">3</div>
              <div className="step-label">Payment</div>
            </div>
            <div className={`booking-step ${step >= 4 ? "active" : ""}`}>
              <div className="step-number">4</div>
              <div className="step-label">Confirmed</div>
            </div>
          </div>

          {/* Step 1: Date Selection */}
          {step === 1 && (
            <div className="fade-in-up">
              <div className="calendar">
                <div className="calendar-header">
                  <h3>Select Date</h3>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  {getDaysInMonth()
                    .slice(0, 14)
                    .map((date, index) => (
                      <div
                        key={index}
                        className={`calendar-day ${
                          selectedDate?.toDateString() === date.toDateString()
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleDateSelect(date)}
                        style={{
                          cursor: "pointer",
                          padding: "15px",
                          textAlign: "center",
                          background:
                            selectedDate?.toDateString() === date.toDateString()
                              ? "var(--primary-color)"
                              : "var(--white)",
                          color:
                            selectedDate?.toDateString() === date.toDateString()
                              ? "var(--white)"
                              : "var(--text-primary)",
                          borderRadius: "8px",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        <div
                          style={{ fontSize: "0.8rem", marginBottom: "5px" }}
                        >
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                          {date.getDate()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && (
            <div className="fade-in-up">
              <div className="time-slots-section">
                <h4>Select Time Slot</h4>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "20px",
                  }}
                >
                  {formatDate(selectedDate)}
                </p>
                <div className="time-slots-grid">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      className={`time-slot-btn ${
                        selectedTime === time ? "selected" : ""
                      }`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="booking-summary">
                <h4>Booking Summary</h4>
                <div className="summary-item">
                  <span className="summary-label">Doctor</span>
                  <span className="summary-value">
                    Dr. {doctor.user.firstName} {doctor.user.lastName}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Specialty</span>
                  <span className="summary-value">{doctor.specialty}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Date</span>
                  <span className="summary-value">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                {selectedTime && (
                  <div className="summary-item">
                    <span className="summary-label">Time</span>
                    <span className="summary-value">
                      {formatTime(selectedTime)}
                    </span>
                  </div>
                )}
                <div className="summary-item">
                  <span className="summary-label">Total Fee</span>
                  <span className="summary-value total">
                    {formatCurrency(doctor.consultationFee)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && appointment && (
            <div className="fade-in-up">
              <div className="payment-section">
                <h4>Complete Payment</h4>
                <div className="payment-info">
                  <i className="fas fa-shield-alt"></i>
                  <p>Your payment is secured with Stripe</p>
                </div>
                <StripePayment
                  appointment={appointment}
                  amount={doctor.consultationFee}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="booking-success fade-in-up">
              <div className="success-icon">
                <i className="fas fa-check"></i>
              </div>
              <h3>Booking Confirmed!</h3>
              <p>
                Your appointment has been successfully booked and confirmed.
              </p>
              <div className="booking-details-box">
                <h4 style={{ marginBottom: "15px" }}>Appointment Details</h4>
                <p>
                  <strong>Doctor:</strong> Dr. {doctor.user.firstName}{" "}
                  {doctor.user.lastName}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedDate)}
                </p>
                <p>
                  <strong>Time:</strong> {formatTime(selectedTime)}
                </p>
                <p>
                  <strong>Fee:</strong> {formatCurrency(doctor.consultationFee)}
                </p>
              </div>
              <button className="btn btn-primary" onClick={onSuccess}>
                View My Appointments
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {step < 3 && (
            <div className="booking-actions">
              {step > 1 && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setStep(step - 1)}
                >
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={handleContinue}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : step === 2
                  ? "Continue to Payment"
                  : "Continue"}
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
