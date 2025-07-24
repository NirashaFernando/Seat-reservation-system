import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Seats APIs
export const seatsAPI = {
  getAll: (date, timeSlot) => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (timeSlot) params.append("timeSlot", timeSlot);
    return api.get(`/seats?${params.toString()}`);
  },
  getByArea: (area) => api.get(`/seats?area=${area}`),
  create: (seatData) => api.post("/seats", seatData),
  updateSeat: (id, data) => api.put(`/seats/${id}`, data),
  delete: (id) => api.delete(`/seats/${id}`),
  getSeatStats: () => api.get("/seats/stats"),
};

// Reservations APIs
export const reservationsAPI = {
  getAll: () => api.get("/reservations/all"),
  getUserReservations: () => api.get("/reservations/my"),
  getCurrentReservations: () => api.get("/reservations/my/current"),
  getPastReservations: () => api.get("/reservations/my/past"),
  create: (reservationData) => api.post("/reservations", reservationData),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  cancel: (id) => api.delete(`/reservations/${id}`),
  getUpcoming: () => api.get("/reservations/upcoming"),
  getHistory: () => api.get("/reservations/history"),
  manualAssign: (assignmentData) =>
    api.post("/reservations/manual-assign", assignmentData),
};

// Utility functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};

export const isIntern = () => {
  const user = getUser();
  return user?.role === "intern";
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default api;
