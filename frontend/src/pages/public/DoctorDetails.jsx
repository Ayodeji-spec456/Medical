import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { doctorService } from "../../services/doctorService";
import { useAuth } from "../../context/AuthContext";
import BookingModal from "../../components/patient/BookingModal";
import Loader from "../../components/common/Loader";
import { formatCurrency, getInitials } from "../../utils/helpers";
import "../../styles/doctor.css";

const DoctorDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctorById(id);
      setDoctor(data);
    } catch (error) {
      toast.error("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      return;
    }
    if (user.role !== "patient") {
      toast.error("Only patients can book appointments");
      return;
    }
    setShowBooking(true);
  };

  if (loading) return <Loader fullScreen />;
  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="doctor-details-page">
      <div className="page-header fade-in-down">
        <div className="container">
          <h1>Doctor Profile</h1>
          <div className="breadcrumb">
            <a href="/">Home</a>
            <i className="fas fa-chevron-right"></i>
            <a href="/doctors">Doctors</a>
            <i className="fas fa-chevron-right"></i>
            <span>
              Dr. {doctor.user.firstName} {doctor.user.lastName}
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="doctor-details-container">
          <div className="doctor-profile-card fade-in-left">
            <div className="doctor-profile-header">
              <div className="doctor-profile-avatar">
                {getInitials(doctor.user.firstName, doctor.user.lastName)}
              </div>
              <div className="doctor-profile-info">
                <h1>
                  Dr. {doctor.user.firstName} {doctor.user.lastName}
                </h1>
                <div className="doctor-specialty">{doctor.specialty}</div>
                <div className="profile-badges">
                  <span className="profile-badge">
                    <i className="fas fa-check-circle"></i> Verified
                  </span>
                  <span className="profile-badge">
                    <i className="fas fa-graduation-cap"></i>{" "}
                    {doctor.experience} years
                  </span>
                  <span className="profile-badge">
                    <i className="fas fa-star"></i> {doctor.rating || 4.5}
                  </span>
                </div>
              </div>
            </div>

            <div className="doctor-profile-body">
              <div className="profile-section">
                <h3>
                  <i className="fas fa-user"></i> About
                </h3>
                <p>
                  {doctor.bio ||
                    "Experienced medical professional dedicated to providing quality healthcare."}
                </p>
              </div>

              <div className="profile-section">
                <h3>
                  <i className="fas fa-info-circle"></i> Details
                </h3>
                <div className="profile-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Specialty</span>
                    <span className="detail-value">{doctor.specialty}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Experience</span>
                    <span className="detail-value">
                      {doctor.experience} years
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">License Number</span>
                    <span className="detail-value">{doctor.licenseNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">
                      {doctor.city}, {doctor.state}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{doctor.address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{doctor.user.phone}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>
                  <i className="fas fa-clock"></i> Availability
                </h3>
                <div className="availability-grid">
                  {doctor.availability && doctor.availability.length > 0 ? (
                    doctor.availability.map((slot, index) => (
                      <div key={index} className="availability-item">
                        <span className="availability-day">{slot.day}</span>
                        <span className="availability-time">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span
                          className={`availability-status ${
                            slot.isAvailable ? "available" : "unavailable"
                          }`}
                        >
                          {slot.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No availability information</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="booking-sidebar fade-in-right">
            <div className="booking-card">
              <h3>Book Appointment</h3>
              <div className="booking-fee">
                <div className="booking-fee-label">Consultation Fee</div>
                <div className="booking-fee-amount">
                  {formatCurrency(doctor.consultationFee)}
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                onClick={handleBookAppointment}
              >
                <i className="fas fa-calendar-plus"></i> Book Now
              </button>
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#e3f2fd",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                }}
              >
                <i
                  className="fas fa-info-circle"
                  style={{ color: "var(--primary-color)" }}
                ></i>
                <p
                  style={{
                    margin: "10px 0 0 0",
                    color: "var(--text-secondary)",
                  }}
                >
                  Cancellations are allowed up to 24 hours before the
                  appointment with full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          doctor={doctor}
          onClose={() => setShowBooking(false)}
          onSuccess={() => {
            setShowBooking(false);
            toast.success("Appointment booked successfully!");
          }}
        />
      )}
    </div>
  );
};

export default DoctorDetails;
