import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../styles/dashboard.css';

const DoctorVerification = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/doctors/pending');
      setPendingDoctors(response.data);
    } catch (error) {
      toast.error('Failed to load pending doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/doctors/${id}/approve`);
      toast.success('Doctor approved successfully');
      fetchPendingDoctors();
    } catch (error) {
      toast.error('Failed to approve doctor');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this doctor?')) {
      return;
    }
    
    try {
      await api.put(`/admin/doctors/${id}/reject`);
      toast.success('Doctor rejected');
      fetchPendingDoctors();
    } catch (error) {
      toast.error('Failed to reject doctor');
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>Doctor Verification</h1>
          <p>Review and verify doctor registrations</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : pendingDoctors.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {pendingDoctors.map((doctor) => (
              <div key={doctor._id} className="card fade-in-up">
                <div className="card-body" style={{ padding: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--success-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', fontSize: '32px', fontWeight: '600' }}>
                          {doctor.user?.firstName?.[0]}{doctor.user?.lastName?.[0]}
                        </div>
                        <div>
                          <h3 style={{ marginBottom: '5px' }}>
                            Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                          </h3>
                          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                            {doctor.specialty}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Email</strong>
                          <span>{doctor.user?.email}</span>
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Phone</strong>
                          <span>{doctor.user?.phone}</span>
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>License Number</strong>
                          <span>{doctor.licenseNumber}</span>
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Experience</strong>
                          <span>{doctor.experience} years</span>
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Consultation Fee</strong>
                          <span>${(doctor.consultationFee / 100).toFixed(2)}</span>
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Location</strong>
                          <span>{doctor.city}, {doctor.state}</span>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Address</strong>
                          <span>{doctor.address}</span>
                        </div>
                      </div>

                      {doctor.bio && (
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Bio</strong>
                          <p style={{ color: 'var(--text-primary)' }}>{doctor.bio}</p>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(doctor.user._id)}
                      >
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(doctor.user._id)}
                      >
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <h3>No Pending Verifications</h3>
            <p>All doctor applications have been processed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorVerification;