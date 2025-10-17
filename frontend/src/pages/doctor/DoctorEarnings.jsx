import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { paymentService } from '../../services/paymentService';
import { formatDate, formatCurrency } from '../../utils/helpers';
import '../../styles/dashboard.css';

const DoctorEarnings = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getPaymentHistory();
      setPayments(data);
      calculateStats(data);
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (payments) => {
    const completed = payments.filter(p => p.status === 'completed');
    const totalEarnings = completed.reduce((sum, p) => sum + p.amount, 0);
    
    const thisMonth = completed.filter(p => {
      const paymentDate = new Date(p.createdAt);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && 
             paymentDate.getFullYear() === now.getFullYear();
    }).reduce((sum, p) => sum + p.amount, 0);

    setStats({
      totalEarnings,
      thisMonth,
      completed: completed.length,
      pending: payments.filter(p => p.status === 'pending').length
    });
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>My Earnings</h1>
          <p>Track your earnings and payment history</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card fade-in-up stagger-1">
            <div className="stat-icon success">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.totalEarnings)}</h3>
              <span className="stat-label">Total Earnings</span>
            </div>
          </div>
          <div className="stat-card fade-in-up stagger-2">
            <div className="stat-icon primary">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.thisMonth)}</h3>
              <span className="stat-label">This Month</span>
            </div>
          </div>
          <div className="stat-card fade-in-up stagger-3">
            <div className="stat-icon success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <span className="stat-label">Completed Payments</span>
            </div>
          </div>
          <div className="stat-card fade-in-up stagger-4">
            <div className="stat-icon warning">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="dashboard-table fade-in-up">
          <div className="table-header">
            <h3>Payment History</h3>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner"></div>
            </div>
          ) : payments.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{formatDate(payment.createdAt)}</td>
                      <td>{payment.patient?.firstName} {payment.patient?.lastName}</td>
                      <td><strong>{formatCurrency(payment.amount)}</strong></td>
                      <td>
                        <span className={`status-badge ${payment.status}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {payment.stripePaymentId?.substring(0, 20)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-receipt"></i>
              </div>
              <h3>No Payment History</h3>
              <p>Your payment history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorEarnings;