import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { getGreeting } from '../../utils/helpers';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>{getGreeting()}, Admin!</h1>
          <p>Platform overview and management</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card fade-in-up stagger-1">
            <div className="stat-icon primary">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalPatients}</h3>
              <span className="stat-label">Total Patients</span>
            </div>
          </div>
          <div className="stat-card fade-in-up stagger-2">
            <div className="stat-icon success">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalDoctors}</h3>
              <span className="stat-label">Verified Doctors</span>
            </div>
          </div>
          <div className="stat-card fade-in-up stagger-3">
            <div className="stat-icon warning">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalAppointments}</h3>
              <span className="stat-label">Total Appointments</span>
            </div>
          </div>
          <div className="stat-card fade-in-up stagger-4">
            <div className="stat-icon success">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-info">
              <h3>${(stats.totalRevenue / 100).toFixed(0)}</h3>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card fade-in-up" style={{ marginBottom: '30px' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '20px' }}>Admin Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <Link to="/admin/verify-doctors" className="btn btn-primary">
                <i className="fas fa-user-check"></i> Verify Doctors
              </Link>
              <Link to="/admin/doctors" className="btn btn-outline-primary">
                <i className="fas fa-user-md"></i> Manage Doctors
              </Link>
              <Link to="/admin/patients" className="btn btn-outline-primary">
                <i className="fas fa-users"></i> Manage Patients
              </Link>
              <Link to="/admin/appointments" className="btn btn-outline-primary">
                <i className="fas fa-calendar"></i> All Appointments
              </Link>
              <Link to="/admin/revenue" className="btn btn-outline-primary">
                <i className="fas fa-chart-bar"></i> Revenue Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="row">
          <div className="col-6">
            <div className="card fade-in-up">
              <div className="card-header">
                <h3>Platform Activity</h3>
              </div>
              <div className="card-body">
                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>Active Users</span>
                      <strong>{stats.totalPatients + stats.totalDoctors}</strong>
                    </div>
                    <div style={{ height: '8px', background: 'var(--light-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '75%', background: 'var(--primary-color)' }}></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>Appointments</span>
                      <strong>{stats.totalAppointments}</strong>
                    </div>
                    <div style={{ height: '8px', background: 'var(--light-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '85%', background: 'var(--success-color)' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>Revenue</span>
                      <strong>${(stats.totalRevenue / 100).toFixed(2)}</strong>
                    </div>
                    <div style={{ height: '8px', background: 'var(--light-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '90%', background: 'var(--warning-color)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="card fade-in-up">
              <div className="card-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="card-body">
                <div style={{ padding: '20px' }}>
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                    Activity logs coming soon...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;