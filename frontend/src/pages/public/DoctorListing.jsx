import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorService } from '../../services/doctorService';
import DoctorCard from '../../components/doctor/DoctorCard';
import Loader from '../../components/common/Loader';
import { SPECIALTIES } from '../../utils/constants';
import '../../styles/doctor.css';

const DoctorListing = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: searchParams.get('specialty') || '',
    city: '',
    state: '',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctors(filters);
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchDoctors();
  };

  const handleReset = () => {
    setFilters({ specialty: '', city: '', state: '', search: '' });
    setTimeout(fetchDoctors, 100);
  };

  return (
    <div className="doctor-listing-page">
      <div className="page-header fade-in-down">
        <div className="container">
          <h1>Find Your Doctor</h1>
          <p>Browse through our list of verified healthcare professionals</p>
          <div className="breadcrumb">
            <a href="/">Home</a>
            <i className="fas fa-chevron-right"></i>
            <span>Doctors</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="search-filter-section fade-in-up">
          <div className="filter-row">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search doctors..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label>Specialty</label>
              <select
                name="specialty"
                className="form-control form-select"
                value={filters.specialty}
                onChange={handleFilterChange}
              >
                <option value="">All Specialties</option>
                {SPECIALTIES.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="Enter city"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="Enter state"
                value={filters.state}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label>&nbsp;</label>
              <button className="btn btn-primary" onClick={handleSearch}>
                <i className="fas fa-search"></i> Search
              </button>
            </div>
            <div className="filter-group">
              <label>&nbsp;</label>
              <button className="btn btn-secondary" onClick={handleReset}>
                <i className="fas fa-redo"></i> Reset
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : doctors.length > 0 ? (
          <div className="doctors-grid">
            {doctors.map((doctor, index) => (
              <div key={doctor._id} className={`stagger-${(index % 3) + 1}`}>
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <h3>No Doctors Found</h3>
            <p>Try adjusting your search filters</p>
            <button className="btn btn-primary" onClick={handleReset}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorListing;