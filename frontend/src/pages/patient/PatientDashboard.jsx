import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/appointmentService";
import { formatDate, formatTime, getGreeting } from "../../utils/helpers";
import "../../styles/dashboard.css";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getPatientAppointments();
      setAppointments(data);
      calculateStats(data);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointments) => {
    setStats({
      total: appointments.length,
      upcoming: appointments.filter(
        (a) => a.status === "confirmed" || a.status === "pending"
      ).length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    });
  };

  const upcomingAppointments = appointments
    .filter((a) => ["pending", "confirmed"].includes(a.status))
    .slice(0, 5);

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>
            {getGreeting()}, {user.firstName}!
          </h1>
          <p>Welcome to your patient dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card fade-in-up stagger-1">
            <div className="stat-icon primary">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <span className="stat-label">Total Appointments</span>
            </div>
          </div>
          <div className="stat-card fade-in-up stagger-2">
            <div className="stat-icon success">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.upcoming}</h3>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>
          <div className="stat-card fade-in-up stagger-3">
            <div className="stat-icon warning">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card fade-in-up stagger-4">
            <div className="stat-icon danger">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.cancelled}</h3>
              <span className="stat-label">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card fade-in-up" style={{ marginBottom: "30px" }}>
          <div className="card-body">
            <h3 style={{ marginBottom: "20px" }}>Quick Actions</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
              }}
            >
              <Link to="/doctors" className="btn btn-primary">
                <i className="fas fa-search"></i> Find Doctors
              </Link>
              <Link
                to="/patient/appointments"
                className="btn btn-outline-primary"
              >
                <i className="fas fa-calendar"></i> My Appointments
              </Link>
              <Link to="/patient/profile" className="btn btn-outline-primary">
                <i className="fas fa-user"></i> My Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="dashboard-table fade-in-up">
          <div className="table-header">
            <h3>Upcoming Appointments</h3>
            <Link
              to="/patient/appointments"
              className="btn btn-sm btn-outline-primary"
            >
              View All
            </Link>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div className="appointments-grid" style={{ padding: "20px" }}>
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-info">
                    <div className="appointment-header">
                      <div className="appointment-avatar">
                        {appointment.doctor?.firstName?.[0]}
                        {appointment.doctor?.lastName?.[0]}
                      </div>
                      <div className="appointment-patient">
                        <h4>
                          Dr. {appointment.doctor?.firstName}{" "}
                          {appointment.doctor?.lastName}
                        </h4>
                        <p>
                          Consultation Fee: $
                          {(appointment.consultationFee / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-item">
                        <i className="fas fa-calendar"></i>
                        <span>{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <span>{formatTime(appointment.appointmentTime)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <span className={`status-badge ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-calendar-times"></i>
              </div>
              <h3>No Upcoming Appointments</h3>
              <p>Book an appointment with a doctor to get started</p>
              <Link to="/doctors" className="btn btn-primary">
                Find Doctors
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
