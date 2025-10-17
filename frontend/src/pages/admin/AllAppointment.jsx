import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { formatDate, formatTime, formatCurrency } from "../../utils/helpers";
import "../../styles/dashboard.css";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/appointments");
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>All Appointments</h1>
          <p>Monitor all platform appointments</p>
        </div>

        {/* Filter Tabs */}
        <div className="card fade-in-up" style={{ marginBottom: "30px" }}>
          <div className="card-body" style={{ padding: "20px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                className={`btn ${
                  filter === "all" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFilter("all")}
              >
                All ({appointments.length})
              </button>
              <button
                className={`btn ${
                  filter === "pending" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFilter("pending")}
              >
                Pending (
                {appointments.filter((a) => a.status === "pending").length})
              </button>
              <button
                className={`btn ${
                  filter === "confirmed" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFilter("confirmed")}
              >
                Confirmed (
                {appointments.filter((a) => a.status === "confirmed").length})
              </button>
              <button
                className={`btn ${
                  filter === "completed" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFilter("completed")}
              >
                Completed (
                {appointments.filter((a) => a.status === "completed").length})
              </button>
              <button
                className={`btn ${
                  filter === "cancelled" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFilter("cancelled")}
              >
                Cancelled (
                {appointments.filter((a) => a.status === "cancelled").length})
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="dashboard-table fade-in-up">
          <div className="table-header">
            <h3>Appointments List</h3>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner"></div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Fee</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{formatDate(appointment.appointmentDate)}</td>
                      <td>{formatTime(appointment.appointmentTime)}</td>
                      <td>
                        <div>
                          <strong>
                            {appointment.patient?.firstName}{" "}
                            {appointment.patient?.lastName}
                          </strong>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {appointment.patient?.email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>
                            Dr. {appointment.doctor?.firstName}{" "}
                            {appointment.doctor?.lastName}
                          </strong>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {appointment.doctor?.email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>
                          {formatCurrency(appointment.consultationFee)}
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`badge badge-${
                            appointment.paymentStatus === "paid"
                              ? "success"
                              : appointment.paymentStatus === "refunded"
                              ? "secondary"
                              : "warning"
                          }`}
                        >
                          {appointment.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-calendar-times"></i>
              </div>
              <h3>No Appointments Found</h3>
              <p>No {filter !== "all" ? filter : ""} appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;
