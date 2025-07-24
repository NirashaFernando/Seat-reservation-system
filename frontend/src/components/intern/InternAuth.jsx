import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  ArrowBack,
  Login,
  PersonAdd,
  Email,
  Lock,
  Business,
} from "@mui/icons-material";

const InternAuth = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for login, 1 for register
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const departments = [
    "Information Technology",
    "Software Engineering",
    "Computer Science",
    "Data Science",
    "Cybersecurity",
    "Business Administration",
    "Marketing",
    "Finance",
    "Human Resources",
    "Other",
  ];

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError("");
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isLogin = activeTab === 0;
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const data = isLogin
        ? { email: loginData.email, password: loginData.password }
        : { ...registerData, role: "intern" };

      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        data
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/intern/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 3 }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              color: "success.main",
              "&:hover": { backgroundColor: "success.light" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="body2"
            color="success.dark"
            sx={{ ml: 1, display: "inline" }}
          >
            Back to Home
          </Typography>
        </Box>

        <Card
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)",
              color: "white",
              p: 3,
              textAlign: "center",
            }}
          >
            <Person sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Intern Portal
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Access your seat reservation dashboard
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
            >
              <Tab
                label="Sign In"
                icon={<Login />}
                iconPosition="start"
                sx={{ textTransform: "none", fontSize: "1rem" }}
              />
              <Tab
                label="Register"
                icon={<PersonAdd />}
                iconPosition="start"
                sx={{ textTransform: "none", fontSize: "1rem" }}
              />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {/* Login Form */}
              {activeTab === 0 && (
                <Box sx={{ py: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      name="email"
                      type="email"
                      label="Email Address"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      fullWidth
                      variant="outlined"
                      autoComplete="email"
                      InputProps={{
                        startAdornment: (
                          <Email sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                    <TextField
                      name="password"
                      type="password"
                      label="Password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      fullWidth
                      variant="outlined"
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <Lock sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                  </Stack>
                </Box>
              )}

              {/* Register Form */}
              {activeTab === 1 && (
                <Box sx={{ py: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      name="name"
                      type="text"
                      label="Full Name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required
                      fullWidth
                      variant="outlined"
                      autoComplete="name"
                      InputProps={{
                        startAdornment: (
                          <Person sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                    <TextField
                      name="email"
                      type="email"
                      label="Email Address"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                      fullWidth
                      variant="outlined"
                      autoComplete="email"
                      InputProps={{
                        startAdornment: (
                          <Email sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                    <TextField
                      name="password"
                      type="password"
                      label="Password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      fullWidth
                      variant="outlined"
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <Lock sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Department</InputLabel>
                      <Select
                        name="department"
                        value={registerData.department}
                        onChange={handleRegisterChange}
                        required
                        label="Department"
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept}>
                            {dept}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  background:
                    "linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)",
                  },
                }}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : activeTab === 0 ? (
                    <Login />
                  ) : (
                    <PersonAdd />
                  )
                }
              >
                {loading
                  ? "Processing..."
                  : activeTab === 0
                  ? "Sign In"
                  : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default InternAuth;
