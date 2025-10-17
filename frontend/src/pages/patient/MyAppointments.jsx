import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { appointmentService } from '../../services/appointmentService';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';
import '../../styles/dashboard.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getPatientAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentService.cancelAppointment(id);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleAcceptAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to accept this proposed appointment?')) {
      return;
    }

    try {
      await appointmentService.acceptAppointment(id);
      toast.success('Appointment accepted successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept appointment');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>My Appointments</h1>
          <p>Manage all your appointments in one place</p>
        </div>

        {/* Filter Tabs */}
        <div className="card fade-in-up" style={{ marginBottom: '30px' }}>
          <div className="card-body" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
              >
                All ({appointments.length})
              </button>
              <button
                className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({appointments.filter(a => a.status === 'pending').length})
              </button>
              <button
                className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('confirmed')}
              >
                Confirmed ({appointments.filter(a => a.status === 'confirmed').length})
              </button>
              <button
                className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('completed')}
              >
                Completed ({appointments.filter(a => a.status === 'completed').length})
              </button>
              <button
                className={`btn ${filter === 'proposed' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('proposed')}
              >
                Proposed ({appointments.filter(a => a.status === 'proposed').length})
              </button>
              <button
                className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('cancelled')}
              >
                Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
              </button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="appointments-grid fade-in-up">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-info">
                  <div className="appointment-header">
                    <div className="appointment-avatar">
                      {appointment.doctor?.firstName?.[0]}{appointment.doctor?.lastName?.[0]}
                    </div>
                    <div className="appointment-patient">
                      <h4>Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}</h4>
                      <p>{appointment.doctor?.email}</p>
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
                    <div className="detail-item">
                      <i className="fas fa-dollar-sign"></i>
                      <span>{formatCurrency(appointment.consultationFee)}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-info-circle"></i>
                      <span>Payment: {appointment.paymentStatus}</span>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div style={{ marginTop: '15px', padding: '10px', background: 'var(--light-color)', borderRadius: '5px' }}>
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}
                </div>
                <div className="appointment-actions">
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                  {appointment.status === 'proposed' && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAcceptAppointment(appointment._id)}
                    >
                      Accept
                    </button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h3>No Appointments Found</h3>
            <p>You don't have any {filter !== 'all' ? filter : ''} appointments yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;