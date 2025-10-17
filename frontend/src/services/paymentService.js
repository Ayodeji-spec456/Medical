import api from "./api";

export const paymentService = {
  createPaymentIntent: async (appointmentId, amount) => {
    const response = await api.post("/payments/create-intent", {
      appointmentId,
      amount,
    });
    return response.data;
  },

  confirmCheckout: async (sessionId) => {
    const response = await api.post("/payments/confirm-checkout", {
      sessionId,
    });
    return response.data;
  },

  refundPayment: async (paymentIntentId) => {
    const response = await api.post("/payments/refund", { paymentIntentId });
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await api.get("/payments/history");
    return response.data;
  },
};
