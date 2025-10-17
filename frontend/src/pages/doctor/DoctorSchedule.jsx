import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { doctorService } from '../../services/doctorService';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../../utils/constants';
import '../../styles/dashboard.css';

const DoctorSchedule = () => {
  const [availability, setAvailability] = useState(
    DAYS_OF_WEEK.map(day => ({
      day,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: false
    }))
  );
  const [loading, setLoading] = useState(false);

  const handleToggleDay = (index) => {
    const newAvailability = [...availability];
    newAvailability[index].isAvailable = !newAvailability[index].isAvailable;
    setAvailability(newAvailability);
  };

  const handleTimeChange = (index, field, value) => {
    const newAvailability = [...availability];
    newAvailability[index][field] = value;
    setAvailability(newAvailability);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await doctorService.updateAvailability(availability);
      toast.success('Schedule updated successfully');
    } catch (error) {
      toast.error('Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in-down">
          <h1>Manage Schedule</h1>
          <p>Set your weekly availability</p>
        </div>

        <div className="card fade-in-up">
          <div className="card-body" style={{ padding: '40px' }}>
            <div style={{ marginBottom: '30px' }}>
              <div className="alert alert-info">
                <i className="fas fa-info-circle"></i> Set your available hours for each day. Patients will only be able to book appointments during these times.
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {availability.map((slot, index) => (
                <div key={slot.day} className="card" style={{ padding: '20px', border: '2px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 120px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={slot.isAvailable}
                          onChange={() => handleToggleDay(index)}
                          style={{ width: '20px', height: '20px' }}
                        />
                        <strong>{slot.day}</strong>
                      </label>
                    </div>

                    {slot.isAvailable && (
                      <>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                          <label className="form-label">Start Time</label>
                          <select
                            className="form-control form-select"
                            value={slot.startTime}
                            onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                          >
                            {TIME_SLOTS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                          <label className="form-label">End Time</label>
                          <select
                            className="form-control form-select"
                            value={slot.endTime}
                            onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                          >
                            {TIME_SLOTS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {!slot.isAvailable && (
                      <div style={{ flex: 1, color: 'var(--text-secondary)' }}>
                        <em>Not available</em>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Schedule'}
              </button>
              <button className="btn btn-secondary btn-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;