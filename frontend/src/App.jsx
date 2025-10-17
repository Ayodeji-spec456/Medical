import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public Pages
import Home from "./pages/public/Home";
import DoctorListing from "./pages/public/DoctorListing";
import DoctorDetails from "./pages/public/DoctorDetails";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import PaymentSuccess from "./pages/public/PaymentSuccess";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import MyAppointments from "./pages/patient/MyAppointments";
import PatientProfile from "./pages/patient/PatientProfile";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import DoctorAppointments from "./pages/doctor/DoctorAppointment"; // ✅ fixed import
import DoctorEarnings from "./pages/doctor/DoctorEarnings";
import DoctorProfileSetup from "./pages/doctor/DoctorProfileSetup";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorVerification from "./pages/admin/DoctorVerification";
import DoctorManagement from "./pages/admin/DoctorManagement";
import PatientManagement from "./pages/admin/PatientManagement";
import AllAppointments from "./pages/admin/AllAppointment"; // ✅ corrected plural
import RevenueAnalytics from "./pages/admin/RevenueAnalytics";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorListing />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />

            {/* Patient Routes */}
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/profile"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/schedule"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorAppointments /> {/* ✅ fixed usage */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/earnings"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorEarnings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/profile-setup"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorProfileSetup />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verify-doctors"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DoctorVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DoctorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <PatientManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AllAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/revenue"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <RevenueAnalytics />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
