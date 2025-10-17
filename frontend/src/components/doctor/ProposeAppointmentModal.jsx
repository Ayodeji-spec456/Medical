import React, { useState } from "react";
import { toast } from "react-toastify";
import { appointmentService } from "../../services/appointmentService";
import { formatDate, formatTime, formatCurrency } from "../../utils/helpers";
import { TIME_SLOTS } from "../../utils/constants";
import "../../styles/booking.css";

const ProposeAppointmentModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [consultationFee, setConsultationFee] = useState(50);
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
    if (step === 3 && !patientId) {
      toast.error("Please enter patient ID");
      return;
    }
    if (step === 3) {
      proposeAppointment();
    } else {
      setStep(step + 1);
    }
  };

  const proposeAppointment = async () => {
    setLoading(true);
    try {
      const appointmentData = {
        patientId,
        appointmentDate: selectedDate.toISOString().split("T")[0],
        appointmentTime: selectedTime,
        consultationFee,
      };
      await appointmentService.proposeAppointment(appointmentData);
      setStep(4);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to propose appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal" onClick={onClose}>
      <div
        className="booking-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="booking-modal-header">
          <h2>Propose Appointment</h2>
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
              <div className="step-label">Patient & Fee</div>
            </div>
            <div className={`booking-step ${step >= 4 ? "active" : ""}`}>
              <div className="step-number">4</div>
              <div className="step-label">Success</div>
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
            </div>
          )}

          {/* Step 3: Patient & Fee */}
          {step === 3 && (
            <div className="fade-in-up">
              <div className="patient-fee-section">
                <h4>Enter Patient Details</h4>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Enter patient ID"
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Consultation Fee ($)
                  </label>
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    min="0"
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <div className="booking-summary">
                  <h4>Appointment Summary</h4>
                  <div className="summary-item">
                    <span className="summary-label">Date</span>
                    <span className="summary-value">
                      {formatDate(selectedDate)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Time</span>
                    <span className="summary-value">
                      {formatTime(selectedTime)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Fee</span>
                    <span className="summary-value total">
                      {formatCurrency(consultationFee)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="booking-success fade-in-up">
              <div className="success-icon">
                <i className="fas fa-check"></i>
              </div>
              <h3>Appointment Proposed!</h3>
              <p>
                The appointment has been proposed to the patient. They will need to accept it.
              </p>
              <button className="btn btn-primary" onClick={onSuccess}>
                View My Appointments
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {step < 4 && (
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
                  : step === 3
                  ? "Propose Appointment"
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

export default ProposeAppointmentModal;
