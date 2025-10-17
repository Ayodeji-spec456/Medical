import api from './api';

export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getPatientAppointments: async () => {
    const response = await api.get('/appointments/patient');
    return response.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  },

  proposeAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/propose', appointmentData);
    return response.data;
  },

  acceptAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/accept`);
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};