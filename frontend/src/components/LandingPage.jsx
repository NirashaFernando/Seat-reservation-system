import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Stack,
} from "@mui/material";
import { AdminPanelSettings, Person, EventSeat } from "@mui/icons-material";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <EventSeat
                sx={{
                  fontSize: 64,
                  color: "primary.main",
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                color="text.primary"
                gutterBottom
              >
                Seat Reservation System
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 400, mx: "auto" }}
              >
                Welcome! Please select your role to continue
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Button
                onClick={() => navigate("/admin/auth")}
                variant="contained"
                size="large"
                fullWidth
                startIcon={<AdminPanelSettings />}
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                    boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Admin Login
              </Button>

              <Button
                onClick={() => navigate("/intern/auth")}
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Person />}
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  background:
                    "linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)",
                  boxShadow: "0 4px 15px rgba(56, 142, 60, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)",
                    boxShadow: "0 6px 20px rgba(56, 142, 60, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Intern Login
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LandingPage;
