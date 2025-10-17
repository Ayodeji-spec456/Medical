import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { formatDate, formatCurrency } from "../../utils/helpers";
import "../../styles/dashboard.css";

const RevenueAnalytics = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonth: 0,
    totalTransactions: 0,
    completedPayments: 0,
  });

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/revenue");
      setPayments(response.data);
      calculateStats(response.data);
    } catch (error) {
      toast.error("Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (payments) => {
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const thisMonth = payments
      .filter((p) => {
        const paymentDate = new Date(p.createdAt);
        const now = new Date();
        return (
          paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, p) => sum + p.amount, 0);

    setStats({
      totalRevenue,
      thisMonth,
      totalTransactions: payments.length,
      completedPayments: payments.filter((p) => p.status === "completed")
        .length,
    });
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>Revenue Analytics</h1>
          <p>Track platform earnings and financial metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card fade-in-up stagger-1">
            <div className="stat-icon success">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.totalRevenue)}</h3>
              <span className="stat-label">Total Revenue</span>
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
            <div className="stat-icon warning">
              <i className="fas fa-receipt"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalTransactions}</h3>
              <span className="stat-label">Total Transactions</span>
            </div>
          </div>

          <div className="stat-card fade-in-up stagger-4">
            <div className="stat-icon success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.completedPayments}</h3>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="card fade-in-up" style={{ marginBottom: "30px" }}>
          <div className="card-header">
            <h3>Revenue Overview</h3>
          </div>
          <div className="card-body">
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                background: "var(--light-color)",
                borderRadius: "var(--border-radius)",
              }}
            >
              <i
                className="fas fa-chart-line"
                style={{
                  fontSize: "60px",
                  color: "var(--text-secondary)",
                  opacity: 0.3,
                }}
              ></i>
              <p
                style={{
                  marginTop: "20px",
                  color: "var(--text-secondary)",
                }}
              >
                Revenue chart visualization coming soon...
              </p>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="dashboard-table fade-in-up">
          <div className="table-header">
            <h3>Recent Transactions</h3>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner"></div>
            </div>
          ) : payments.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 20).map((payment) => (
                    <tr key={payment._id}>
                      <td>{formatDate(payment.createdAt)}</td>
                      <td>
                        <div>
                          <strong>
                            {payment.patient?.firstName}{" "}
                            {payment.patient?.lastName}
                          </strong>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {payment.patient?.email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>
                            Dr. {payment.doctor?.firstName}{" "}
                            {payment.doctor?.lastName}
                          </strong>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {payment.doctor?.email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{formatCurrency(payment.amount)}</strong>
                      </td>
                      <td>
                        <span className={`status-badge ${payment.status}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
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
              <h3>No Transactions Yet</h3>
              <p>Transaction history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
