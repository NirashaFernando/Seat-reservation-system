import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import AdminAuth from "../components/admin/AdminAuth";
import InternAuth from "../components/intern/InternAuth";
import AdminDashboard from "../components/Admin/AdminDashboard";
import InternDashboard from "../components/intern/InternDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication Routes */}
      <Route path="/admin/auth" element={<AdminAuth />} />
      <Route path="/intern/auth" element={<InternAuth />} />

      {/* Dashboard Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/intern/dashboard" element={<InternDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
