export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const SPECIALTIES = [
  { value: "cardiology", label: "Cardiology", icon: "❤️" },
  { value: "dermatology", label: "Dermatology", icon: "🩺" },
  { value: "neurology", label: "Neurology", icon: "🧠" },
  { value: "pediatrics", label: "Pediatrics", icon: "👶" },
  { value: "orthopedics", label: "Orthopedics", icon: "🦴" },
  { value: "psychiatry", label: "Psychiatry", icon: "🧘" },
  { value: "general", label: "General Medicine", icon: "🏥" },
  { value: "dentistry", label: "Dentistry", icon: "🦷" },
];

export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
};

export const USER_ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
};

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];
