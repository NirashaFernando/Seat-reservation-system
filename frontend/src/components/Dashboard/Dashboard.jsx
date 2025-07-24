import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  Stack,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  EventSeat,
  History,
  AdminPanelSettings,
  Person,
  ExitToApp,
  ArrowForward,
} from "@mui/icons-material";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
    >
      {/* App Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <EventSeat sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Seat Reservation System
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            {user?.role === "admin" ? (
              <AdminPanelSettings sx={{ mr: 1 }} />
            ) : (
              <Person sx={{ mr: 1 }} />
            )}
            <Typography variant="body2">Welcome, {user?.name}</Typography>
          </Box>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToApp />}
            variant="outlined"
            sx={{ borderColor: "rgba(255,255,255,0.5)" }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Welcome to Your Dashboard
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6" color="text.secondary">
              Hello {user?.name}! You are logged in as
            </Typography>
            <Chip
              label={user?.role}
              color={user?.role === "admin" ? "primary" : "success"}
              variant="filled"
              icon={
                user?.role === "admin" ? <AdminPanelSettings /> : <Person />
              }
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            />
          </Stack>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={4}>
          {/* View Seat Map */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={4}
              sx={{
                height: "100%",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <EventSeat
                  sx={{
                    fontSize: 64,
                    color: "primary.main",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h5"
                  component="h3"
                  fontWeight="bold"
                  gutterBottom
                >
                  View Seat Map
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Browse and reserve available seats for your workspace
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/seats")}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Go to Seat Map
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* My Reservations */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={4}
              sx={{
                height: "100%",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <History
                  sx={{
                    fontSize: 64,
                    color: "success.main",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h5"
                  component="h3"
                  fontWeight="bold"
                  gutterBottom
                >
                  My Reservations
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  View your current and past seat reservations
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/reservations")}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  View Reservations
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Admin Panel (if admin) */}
          {user?.role === "admin" && (
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={4}
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <AdminPanelSettings
                    sx={{
                      fontSize: 64,
                      color: "error.main",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Admin Panel
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Manage seats, users, and system settings
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/admin/dashboard")}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Admin Dashboard
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Quick Actions Card */}
          <Grid item xs={12}>
            <Card elevation={2} sx={{ mt: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  fontWeight="bold"
                  gutterBottom
                >
                  Quick Actions
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EventSeat />}
                      onClick={() => navigate("/seats")}
                      sx={{ py: 1.5, textTransform: "none" }}
                    >
                      Book a Seat
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<History />}
                      onClick={() => navigate("/reservations")}
                      sx={{ py: 1.5, textTransform: "none" }}
                    >
                      View History
                    </Button>
                  </Grid>
                  {user?.role === "admin" && (
                    <>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<AdminPanelSettings />}
                          onClick={() => navigate("/admin/dashboard")}
                          sx={{ py: 1.5, textTransform: "none" }}
                        >
                          Manage System
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Person />}
                          onClick={() => navigate("/admin/users")}
                          sx={{ py: 1.5, textTransform: "none" }}
                        >
                          Manage Users
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* System Status */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            System Status: All services are operational
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
