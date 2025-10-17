import React from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, getInitials } from "../../utils/helpers";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/doctors/${doctor._id}`);
  };

  return (
    <div className="doctor-card fade-in-up">
      <div className="doctor-card-header">
        <div className="doctor-avatar">
          {getInitials(doctor.user.firstName, doctor.user.lastName)}
        </div>
        <div className="doctor-verified">
          <i className="fas fa-check-circle"></i> Verified
        </div>
      </div>

      <div className="doctor-card-body">
        <h3 className="doctor-name">
          Dr. {doctor.user.firstName} {doctor.user.lastName}
        </h3>
        <span className="doctor-specialty">{doctor.specialty}</span>

        <div className="doctor-info">
          <div className="info-item">
            <i className="fas fa-graduation-cap"></i>
            <span>{doctor.experience} years experience</span>
          </div>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>
              {doctor.city}, {doctor.state}
            </span>
          </div>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <span>{doctor.user.phone}</span>
          </div>
        </div>

        <div className="doctor-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fa${
                  i < Math.floor(doctor.rating || 4) ? "s" : "r"
                } fa-star`}
              ></i>
            ))}
          </div>
          <span className="rating-text">
            {doctor.rating || 4.0} ({doctor.totalAppointments || 0} reviews)
          </span>
        </div>

        <div className="doctor-fee">
          <span className="fee-label">Consultation Fee</span>
          <span className="fee-amount">
            {formatCurrency(doctor.consultationFee)}
          </span>
        </div>
      </div>

      <div className="doctor-card-footer">
        <button className="btn-book-now" onClick={handleViewProfile}>
          View Profile & Book
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
