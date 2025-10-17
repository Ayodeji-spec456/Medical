import api from './api';

export const doctorService = {
  getDoctors: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/doctors?${params}`);
    return response.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  completeDoctorProfile: async (profileData) => {
    const response = await api.post('/doctors/profile', profileData);
    return response.data;
  },

  updateAvailability: async (availability) => {
    const response = await api.put('/doctors/availability', { availability });
    return response.data;
  },

  getDoctorAppointments: async () => {
    const response = await api.get('/doctors/appointments');
    return response.data;
  }
};