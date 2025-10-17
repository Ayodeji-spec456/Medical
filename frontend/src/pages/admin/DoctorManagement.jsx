import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../styles/dashboard.css';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/doctors/all');
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor account permanently? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/admin/doctors/${id}/delete`);
      toast.success('Doctor account deleted successfully');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to delete doctor');
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>Doctor Management</h1>
          <p>Manage all registered doctors</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : doctors.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {doctors.map((doctor) => {
              const user = doctor.user;
              const isApproved = user?.isApproved || false;
              const status = isApproved ? 'Approved' : 'Pending Approval';
              const statusClass = isApproved ? 'status-approved' : 'status-pending';

              return (
                <div key={doctor._id} className="card fade-in-up">
                  <div className="card-body" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                      <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--success-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', fontSize: '32px', fontWeight: '600' }}>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </div>
                          <div>
                            <h3 style={{ marginBottom: '5px' }}>
                              Dr. {user?.firstName} {user?.lastName}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                              {doctor.specialty} • <span className={statusClass}>{status}</span>
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Email</strong>
                            <span>{user?.email}</span>
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Phone</strong>
                            <span>{user?.phone}</span>
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
                        {!isApproved && (
                          <Link to={`/admin/verify-doctors`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                            <i className="fas fa-edit"></i> Review
                          </Link>
                        )}
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          <i className="fas fa-trash"></i> Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <h3>No Doctors Found</h3>
            <p>No doctors are currently registered</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;
