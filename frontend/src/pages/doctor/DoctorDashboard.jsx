import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { formatDate, formatTime, getGreeting } from '../../utils/helpers';
import '../../styles/dashboard.css';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    today: 0,
    upcoming: 0,
    completed: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctorAppointments();
      setAppointments(data);
      calculateStats(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointments) => {
    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(
      a => new Date(a.appointmentDate).toDateString() === today
    );
    const upcoming = appointments.filter(
      a => ['pending', 'confirmed'].includes(a.status)
    );
    const completed = appointments.filter(a => a.status === 'completed');
    const earnings = completed.reduce((sum, a) => sum + a.consultationFee, 0);

    setStats({
      today: todayAppointments.length,
      upcoming: upcoming.length,
      completed: completed.length,
      totalEarnings: earnings
    });
  };

  const todayAppointments = appointments.filter(
    a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()
  ).slice(0, 5);

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>{getGreeting()}, Dr. {user.firstName}!</h1>
          <p>Your medical practice dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card fade-in-up stagger-1">
            <div className="stat-icon primary">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.today}</h3>
              <span className="stat-label">Today's Appointments</span>
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
            <div className="stat-icon success">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-info">
              <h3>${(stats.totalEarnings / 100).toFixed(0)}</h3>
              <span className="stat-label">Total Earnings</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card fade-in-up" style={{ marginBottom: '30px' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '20px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <Link to="/doctor/schedule" className="btn btn-primary">
                <i className="fas fa-calendar-alt"></i> Manage Schedule
              </Link>
              <Link to="/doctor/appointments" className="btn btn-outline-primary">
                <i className="fas fa-calendar-check"></i> All Appointments
              </Link>
              <Link to="/doctor/earnings" className="btn btn-outline-primary">
                <i className="fas fa-chart-line"></i> View Earnings
              </Link>
              <Link to="/doctor/profile-setup" className="btn btn-outline-primary">
                <i className="fas fa-user-cog"></i> Update Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="dashboard-table fade-in-up">
          <div className="table-header">
            <h3>Today's Appointments</h3>
            <Link to="/doctor/appointments" className="btn btn-sm btn-outline-primary">
              View All
            </Link>
          </div>
          {todayAppointments.length > 0 ? (
            <div className="appointments-grid" style={{ padding: '20px' }}>
              {todayAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-info">
                    <div className="appointment-header">
                      <div className="appointment-avatar">
                        {appointment.patient?.firstName?.[0]}{appointment.patient?.lastName?.[0]}
                      </div>
                      <div className="appointment-patient">
                        <h4>{appointment.patient?.firstName} {appointment.patient?.lastName}</h4>
                        <p>{appointment.patient?.email}</p>
                      </div>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <span>{formatTime(appointment.appointmentTime)}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-phone"></i>
                        <span>{appointment.patient?.phone}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-dollar-sign"></i>
                        <span>${(appointment.consultationFee / 100).toFixed(2)}</span>
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
              <h3>No Appointments Today</h3>
              <p>You have no scheduled appointments for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;