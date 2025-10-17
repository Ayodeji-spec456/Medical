import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-about">
            <h3>MediBook</h3>
            <p>
              Your trusted platform for booking medical appointments with
              qualified healthcare professionals. Making healthcare accessible
              and convenient for everyone.
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/doctors">Find Doctors</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>For Patients</h3>
            <ul className="footer-links">
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/patient/dashboard">My Dashboard</Link>
              </li>
              <li>
                <Link to="/patient/appointments">My Appointments</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section footer-contact">
            <h3>Contact Us</h3>
            <p>
              <i className="fas fa-phone"></i>
              +234 123 456 7890
            </p>
            <p>
              <i className="fas fa-envelope"></i>
              support@medibook.com
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i>
              123 Healthcare Ave, Medical City
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 MediBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
