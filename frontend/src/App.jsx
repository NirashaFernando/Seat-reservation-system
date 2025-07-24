import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AdminAuth from "./components/admin/AdminAuth";
import InternAuth from "./components/intern/InternAuth";
import AdminDashboard from "./components/admin/AdminDashboard";
import InternDashboard from "./components/intern/InternDashboard";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/intern/auth" element={<InternAuth />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/intern/dashboard" element={<InternDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
