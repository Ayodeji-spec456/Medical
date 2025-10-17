import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.navbar-user')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'patient':
        return '/patient/dashboard';
      default:
        return '/';
    }
  };

  const getInitials = () => {
    if (!user) return '';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <i className="fas fa-heartbeat"></i>
          </div>
          <span className="navbar-logo-text">MediBook</span>
        </Link>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link
              to="/"
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/doctors"
              className={`navbar-link ${location.pathname === '/doctors' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Doctors
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link
                to={getDashboardLink()}
                className={`navbar-link ${
                  location.pathname.includes('dashboard') ? 'active' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-user" onClick={toggleDropdown}>
              <div className="navbar-avatar">{getInitials()}</div>
              <span className="navbar-username">
                {user.firstName} {user.lastName}
              </span>
              <div className={`navbar-dropdown ${dropdownOpen ? 'active' : ''}`}>
                <Link to={getDashboardLink()} className="navbar-dropdown-item" onClick={closeDropdown}>
                  <i className="fas fa-dashboard"></i>
                  Dashboard
                </Link>
                <Link to="/profile" className="navbar-dropdown-item" onClick={closeDropdown}>
                  <i className="fas fa-user"></i>
                  Profile
                </Link>
                {user.role === 'patient' && (
                  <Link to="/patient/appointments" className="navbar-dropdown-item" onClick={closeDropdown}>
                    <i className="fas fa-calendar"></i>
                    My Appointments
                  </Link>
                )}
                <button onClick={handleLogout} className="navbar-dropdown-item">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;