import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (name, email, password, role) =>
    api.post("/auth/register", { name, email, password, role }),
};

// Seats API
export const seatsAPI = {
  getAll: () => api.get("/seats"),
  getById: (id) => api.get(`/seats/${id}`),
  create: (seatData) => api.post("/seats", seatData),
  update: (id, seatData) => api.put(`/seats/${id}`, seatData),
  delete: (id) => api.delete(`/seats/${id}`),
  getAvailability: (date, timeSlot) =>
    api.get(`/seats/availability/${date}/${timeSlot}`),
};

// Reservations API
export const reservationsAPI = {
  // Get all reservations (admin only)
  getAll: () => api.get("/reservations/all"),
  // Get current user's reservations
  getMy: () => api.get("/reservations/my"),
  // Create new reservation
  create: (reservationData) => api.post("/reservations", reservationData),
  // Cancel reservation
  cancel: (id) => api.delete(`/reservations/${id}`),
  // Get available time slots for a seat and date
  getAvailableSlots: (seatId, date) =>
    api.get(`/reservations/available-slots/${seatId}/${date}`),
};

export default api;
