import React, { useState } from "react";
import { toast } from "react-toastify";
import { doctorService } from "../../services/doctorService";
import { SPECIALTIES } from "../../utils/constants";
import "../../styles/dashboard.css";

const DoctorProfileSetup = () => {
  const [formData, setFormData] = useState({
    specialty: "",
    licenseNumber: "",
    experience: "",
    consultationFee: "",
    address: "",
    city: "",
    state: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert fee to cents for backend
      const profileData = {
        ...formData,
        consultationFee: parseInt(formData.consultationFee) * 100,
        experience: parseInt(formData.experience),
      };

      await doctorService.completeDoctorProfile(profileData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>Doctor Profile Setup</h1>
          <p>Complete your professional profile</p>
        </div>

        <div className="card fade-in-up">
          <div className="card-body" style={{ padding: "40px" }}>
            <form onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: "30px" }}>Professional Information</h3>

              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">Specialty *</label>
                    <select
                      name="specialty"
                      className="form-control form-select"
                      value={formData.specialty}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Specialty</option>
                      {SPECIALTIES.map((spec) => (
                        <option key={spec.value} value={spec.value}>
                          {spec.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">License Number *</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      className="form-control"
                      placeholder="e.g., MD123456"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">Years of Experience *</label>
                    <input
                      type="number"
                      name="experience"
                      className="form-control"
                      placeholder="e.g., 5"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">
                      Consultation Fee (USD) *
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      className="form-control"
                      placeholder="e.g., 100"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  className="form-control"
                  placeholder="Tell patients about yourself, your experience, and specializations..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                ></textarea>
              </div>

              <h3 style={{ marginTop: "40px", marginBottom: "30px" }}>
                Practice Location
              </h3>

              <div className="form-group">
                <label className="form-label">Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="alert alert-info" style={{ marginTop: "20px" }}>
                <i className="fas fa-info-circle"></i> After submitting your
                profile, it will be sent for admin verification. You'll be
                notified once approved.
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ marginTop: "30px" }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileSetup;
