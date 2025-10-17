import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../styles/dashboard.css';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/patients/all');
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient account permanently? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/admin/patients/${id}/delete`);
      toast.success('Patient account deleted successfully');
      fetchPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>Patient Management</h1>
          <p>Manage all registered patients</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : patients.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {patients.map((patient) => {
              const user = patient.user;
              return (
                <div key={patient._id} className="card fade-in-up">
                  <div className="card-body" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                      <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--warning-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', fontSize: '32px', fontWeight: '600' }}>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </div>
                          <div>
                            <h3 style={{ marginBottom: '5px' }}>
                              {user?.firstName} {user?.lastName}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                              Patient • Active
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
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Date of Birth</strong>
                            <span>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Gender</strong>
                            <span>{patient.gender || 'Not provided'}</span>
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>City</strong>
                            <span>{patient.city || 'Not provided'}</span>
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>State</strong>
                            <span>{patient.state || 'Not provided'}</span>
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Address</strong>
                            <span>{patient.address || 'Not provided'}</span>
                          </div>
                          {patient.emergencyContact && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Emergency Contact</strong>
                              <span>{patient.emergencyContact} - {patient.emergencyPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              <i className="fas fa-user"></i>
            </div>
            <h3>No Patients Found</h3>
            <p>No patients are currently registered</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;
