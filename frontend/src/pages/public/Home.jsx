import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPECIALTIES } from '../../utils/constants';
import '../../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${searchQuery}`);
    }
  };

  const handleSpecialtyClick = (specialty) => {
    navigate(`/doctors?specialty=${specialty}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text fade-in-left">
              <h1>Find & Book Appointments with Top Doctors</h1>
              <p>
                Connect with qualified healthcare professionals and book your
                appointments instantly. Your health, our priority.
              </p>
              <form className="hero-search" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search for doctors, specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-search"></i> Search
                </button>
              </form>
            </div>
            <div className="hero-image fade-in-right">
              <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
                <circle cx="250" cy="200" r="150" fill="#e3f2fd" opacity="0.5"/>
                <circle cx="250" cy="200" r="120" fill="#bbdefb" opacity="0.7"/>
                <path d="M250 80 L250 320 M130 200 L370 200" stroke="#0d6efd" strokeWidth="8" strokeLinecap="round"/>
                <circle cx="250" cy="200" r="30" fill="#0d6efd"/>
                <text x="250" y="370" fontSize="24" fill="#0d6efd" textAnchor="middle" fontWeight="bold">Healthcare</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-title fade-in-up">
            <h2>Why Choose MediBook?</h2>
            <p>Your trusted partner in healthcare management</p>
          </div>
          <div className="features-grid">
            <div className="feature-card fade-in-up stagger-1">
              <div className="feature-icon">
                <i className="fas fa-search-location"></i>
              </div>
              <h3>Find Doctors</h3>
              <p>
                Search from our extensive database of qualified doctors across
                multiple specialties and locations.
              </p>
            </div>
            <div className="feature-card fade-in-up stagger-2">
              <div className="feature-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Easy Booking</h3>
              <p>
                Book appointments with just a few clicks. Choose your preferred
                date and time slot instantly.
              </p>
            </div>
            <div className="feature-card fade-in-up stagger-3">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure Payments</h3>
              <p>
                Safe and secure payment processing with full refund protection
                for cancelled appointments.
              </p>
            </div>
            <div className="feature-card fade-in-up stagger-4">
              <div className="feature-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>Verified Doctors</h3>
              <p>
                All our doctors are verified professionals with valid licenses
                and credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="specialties-section">
        <div className="container">
          <div className="section-title fade-in-up">
            <h2>Popular Specialties</h2>
            <p>Find doctors by their area of expertise</p>
          </div>
          <div className="specialties-grid">
            {SPECIALTIES.map((specialty, index) => (
              <div
                key={specialty.value}
                className={`specialty-card fade-in-up stagger-${(index % 4) + 1}`}
                onClick={() => handleSpecialtyClick(specialty.value)}
              >
                <div className="specialty-icon">
                  <span style={{ fontSize: '32px' }}>{specialty.icon}</span>
                </div>
                <h4>{specialty.label}</h4>
                <p>Find qualified {specialty.label.toLowerCase()} specialists</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-title fade-in-up">
            <h2>How It Works</h2>
            <p>Book your appointment in 3 simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step-item fade-in-up stagger-1">
              <div className="step-number">1</div>
              <h4>Search Doctor</h4>
              <p>
                Browse through our list of verified doctors by specialty,
                location, or name.
              </p>
            </div>
            <div className="step-item fade-in-up stagger-2">
              <div className="step-number">2</div>
              <h4>Book Appointment</h4>
              <p>
                Select your preferred date and time slot, then proceed with
                secure payment.
              </p>
            </div>
            <div className="step-item fade-in-up stagger-3">
              <div className="step-number">3</div>
              <h4>Get Consultation</h4>
              <p>
                Receive confirmation and visit the doctor at your scheduled
                appointment time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item fade-in-up stagger-1">
              <span className="stat-number">500+</span>
              <span className="stat-label">Verified Doctors</span>
            </div>
            <div className="stat-item fade-in-up stagger-2">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Patients</span>
            </div>
            <div className="stat-item fade-in-up stagger-3">
              <span className="stat-number">50+</span>
              <span className="stat-label">Specialties</span>
            </div>
            <div className="stat-item fade-in-up stagger-4">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-in-up">
            <h2>Ready to Get Started?</h2>
            <p>
              Join thousands of patients who trust MediBook for their healthcare
              needs
            </p>
            <div className="cta-buttons">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/doctors')}
              >
                Find a Doctor
              </button>
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={() => navigate('/register')}
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;