import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from "@mui/material";
import {
  EventSeat,
  PersonOutline,
  ExitToApp,
  AccessTime,
  History,
  Chair,
  Cancel,
  CalendarToday,
  Schedule,
} from "@mui/icons-material";
import { getUser, removeToken } from "../../utils/api";

// Styled Components
const SeatButton = styled(Button)(({ theme, available, selected }) => ({
  minWidth: 40,
  width: 40,
  height: 40,
  fontSize: "0.75rem",
  fontWeight: "bold",
  borderRadius: theme.spacing(0.5),
  border: `2px solid`,
  borderColor: selected
    ? theme.palette.primary.main
    : available
    ? theme.palette.success.main
    : theme.palette.error.main,
  backgroundColor: selected
    ? theme.palette.primary.light
    : available
    ? theme.palette.success.light
    : theme.palette.error.light,
  color: selected
    ? theme.palette.primary.dark
    : available
    ? theme.palette.success.dark
    : theme.palette.error.dark,
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.primary.main
      : available
      ? theme.palette.success.main
      : theme.palette.error.light,
  },
  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.6,
  },
}));

// TabPanel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const InternDashboard = () => {
  const [activeTab, setActiveTab] = useState("book");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seats, setSeats] = useState([]);
  const [filteredSeats, setFilteredSeats] = useState([]);
  const [currentReservations, setCurrentReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Function to group seats by floor/area
  const groupSeatsByArea = (seats) => {
    return seats.reduce((groups, seat) => {
      const area = seat.area || "Unknown";
      if (!groups[area]) {
        groups[area] = [];
      }
      groups[area].push(seat);
      return groups;
    }, {});
  };

  // Validation functions
  const validateBooking = () => {
    // Check if date is selected
    if (!selectedDate) {
      setError("Please select a date");
      setOpenSnackbar(true);
      return false;
    }

    // Check if seat is selected
    if (!selectedSeat) {
      setError("Please select a seat");
      setOpenSnackbar(true);
      return false;
    }

    // Check if past date
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      setError("Past dates cannot be booked");
      setOpenSnackbar(true);
      return false;
    }

    // Check if at least 1 hour in advance for today
    if (selectedDateObj.getTime() === today.getTime()) {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      const currentHour = oneHourFromNow.getHours();

      if (currentHour >= 18) {
        // After 6 PM
        setError(
          "Seats must be reserved at least 1 hour in advance. Too late to book for today."
        );
        setOpenSnackbar(true);
        return false;
      }
    }

    // Check if intern already has a reservation for the selected date
    const existingReservation = currentReservations.find((reservation) => {
      const reservationDate = new Date(reservation.date);
      reservationDate.setHours(0, 0, 0, 0);
      return reservationDate.getTime() === selectedDateObj.getTime();
    });

    if (existingReservation) {
      setError(
        "An intern can only reserve one seat per day. You already have a reservation for this date."
      );
      setOpenSnackbar(true);
      return false;
    }

    // Check if seat is available
    if (!selectedSeat.isAvailable) {
      setError("This seat is already booked and cannot be reserved");
      setOpenSnackbar(true);
      return false;
    }

    return true;
  };

  useEffect(() => {
    fetchSeats();
    fetchReservations();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    } else {
      // Reset to all seats if no date selected
      setFilteredSeats(seats);
      setSelectedSeat(null);
    }
  }, [selectedDate, seats]);

  const fetchSeats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/seats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Add isAvailable property based on seat status
        const seatsWithAvailability = data.map((seat) => ({
          ...seat,
          isAvailable: seat.status === "Available",
        }));
        setSeats(seatsWithAvailability);
        setFilteredSeats(seatsWithAvailability);
      }
    } catch (error) {
      console.error("Error fetching seats:", error);
      setError("Failed to load seats");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const [currentRes, pastRes] = await Promise.all([
        fetch("http://localhost:5000/api/reservations/my/current", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("http://localhost:5000/api/reservations/my/past", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      if (currentRes.ok) {
        const currentData = await currentRes.json();
        setCurrentReservations(currentData);
      }

      if (pastRes.ok) {
        const pastData = await pastRes.json();
        setPastReservations(pastData);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const checkAvailability = async () => {
    if (!selectedDate) return;

    try {
      const params = new URLSearchParams({
        date: selectedDate,
      });

      const response = await fetch(
        `http://localhost:5000/api/seats?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Add isAvailable property based on seat status
        const seatsWithAvailability = data.map((seat) => ({
          ...seat,
          isAvailable: seat.status === "Available",
        }));
        setFilteredSeats(seatsWithAvailability);
        setSelectedSeat(null);
      } else {
        setError("Failed to check availability");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setError("Failed to check availability");
      setOpenSnackbar(true);
    }
  };

  const handleBooking = async () => {
    // Validate booking rules
    if (!validateBooking()) {
      return;
    }

    setBookingLoading(true);
    try {
      console.log("Booking request:", {
        seatId: selectedSeat._id,
        date: selectedDate,
        timeSlot: "09:00-18:00", // Full day booking
      });

      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          seatId: selectedSeat._id,
          date: selectedDate,
          timeSlot: "09:00-18:00", // Full day reservation
        }),
      });

      const responseData = await response.json();
      console.log("Booking response:", responseData);

      if (response.ok) {
        setSuccess("Seat booked successfully for the entire day!");
        setError("");
        setOpenSnackbar(true);
        setSelectedSeat(null);
        setSelectedDate("");
        fetchSeats();
        fetchReservations();
      } else {
        setError(
          responseData.message || responseData.error || "Booking failed"
        );
        setSuccess("");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error booking seat:", error);
      setError("Booking failed. Please try again.");
      setSuccess("");
      setOpenSnackbar(true);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reservations/${reservationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Reservation cancelled successfully!");
        setError("");
        setOpenSnackbar(true);
        fetchReservations();
        fetchSeats();
      } else {
        setError("Failed to cancel reservation");
        setSuccess("");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setError("Failed to cancel reservation");
      setSuccess("");
      setOpenSnackbar(true);
    }
  };

  const handleLogout = () => {
    removeToken();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
    >
      {/* App Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <EventSeat sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Intern Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <PersonOutline sx={{ mr: 1 }} />
            <Typography variant="body2">Welcome, {getUser()?.name}</Typography>
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

      {/* Navigation Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="xl">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            aria-label="dashboard tabs"
            sx={{ minHeight: 64 }}
          >
            <Tab
              label="Book Seat"
              value="book"
              icon={<EventSeat />}
              iconPosition="start"
              sx={{ minHeight: 64, fontSize: "1rem" }}
            />
            <Tab
              label="Current Reservations"
              value="current"
              icon={<AccessTime />}
              iconPosition="start"
              sx={{ minHeight: 64, fontSize: "1rem" }}
            />
            <Tab
              label="Past Reservations"
              value="past"
              icon={<History />}
              iconPosition="start"
              sx={{ minHeight: 64, fontSize: "1rem" }}
            />
          </Tabs>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={error ? "error" : "success"}
            variant="filled"
          >
            {error || success}
          </Alert>
        </Snackbar>

        {/* Book Seat Tab */}
        <TabPanel value={activeTab} index="book">
          <Grid container spacing={3}>
            {/* Booking Form */}
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardHeader
                  title="Book a Seat"
                  avatar={<EventSeat color="primary" />}
                  titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
                />
                <CardContent>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label="Select Date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: new Date().toISOString().split("T")[0],
                        }}
                        variant="outlined"
                        helperText="Select a date to book a seat for the entire day"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleBooking}
                        disabled={
                          !selectedSeat || !selectedDate || bookingLoading
                        }
                        startIcon={
                          bookingLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <EventSeat />
                          )
                        }
                        sx={{
                          py: 1.75,
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          height: "56px",
                        }}
                      >
                        {bookingLoading
                          ? "Booking..."
                          : "Book This Seat for Full Day"}
                      </Button>
                    </Grid>
                  </Grid>

                  {selectedDate && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <strong>Date:</strong>{" "}
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      <br />
                      <strong>Duration:</strong> Full Day (9:00 AM - 6:00 PM)
                    </Alert>
                  )}

                  {/* Selected Seat Info */}
                  {selectedSeat && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <strong>Selected Seat:</strong> {selectedSeat.seatNumber}{" "}
                      ({selectedSeat.area})
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Seat Map */}
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardHeader
                  title="Select a Seat"
                  avatar={<Chair color="primary" />}
                  titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
                  action={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            bgcolor: "success.light",
                            border: 1,
                            borderColor: "success.main",
                            borderRadius: 0.5,
                          }}
                        />
                        <Typography variant="body2">Available</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            bgcolor: "error.light",
                            border: 1,
                            borderColor: "error.main",
                            borderRadius: 0.5,
                          }}
                        />
                        <Typography variant="body2">Unavailable</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            bgcolor: "primary.light",
                            border: 1,
                            borderColor: "primary.main",
                            borderRadius: 0.5,
                          }}
                        />
                        <Typography variant="body2">Selected</Typography>
                      </Box>
                    </Box>
                  }
                />
                <CardContent>
                  {filteredSeats.length === 0 ? (
                    <Alert severity="warning">
                      Please select a date to see available seats.
                    </Alert>
                  ) : (
                    <Box>
                      {Object.entries(groupSeatsByArea(filteredSeats)).map(
                        ([area, areaSeats]) => (
                          <Box key={area} sx={{ mb: 4 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                mb: 2,
                                color: "primary.main",
                                fontWeight: "bold",
                                borderBottom: 1,
                                borderColor: "divider",
                                pb: 1,
                              }}
                            >
                              {area} ({areaSeats.length} seats)
                            </Typography>
                            <Grid container spacing={1}>
                              {areaSeats
                                .sort((a, b) =>
                                  a.seatNumber.localeCompare(b.seatNumber)
                                )
                                .map((seat) => (
                                  <Grid item key={seat._id}>
                                    <SeatButton
                                      onClick={() => setSelectedSeat(seat)}
                                      disabled={!seat.isAvailable}
                                      selected={selectedSeat?._id === seat._id}
                                      available={seat.isAvailable}
                                      size="large"
                                    >
                                      {seat.seatNumber}
                                    </SeatButton>
                                  </Grid>
                                ))}
                            </Grid>
                          </Box>
                        )
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Current Reservations Tab */}
        <TabPanel value={activeTab} index="current">
          <Card elevation={2}>
            <CardHeader
              title="Current Reservations"
              avatar={<AccessTime color="primary" />}
              titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
            />
            <CardContent>
              {currentReservations.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    No current reservations
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab("book")}
                    startIcon={<EventSeat />}
                  >
                    Book a Seat
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Seat</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Floor</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Time Slot</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentReservations.map((reservation) => (
                        <TableRow key={reservation._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {reservation.seatId?.seatNumber || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={reservation.seatId?.area || "Unknown"}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <CalendarToday fontSize="small" color="action" />
                              <Typography variant="body2">
                                {new Date(
                                  reservation.date
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2">
                                {reservation.timeSlot}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={reservation.status}
                              color="success"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() =>
                                handleCancelReservation(reservation._id)
                              }
                              startIcon={<Cancel />}
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Past Reservations Tab */}
        <TabPanel value={activeTab} index="past">
          <Card elevation={2}>
            <CardHeader
              title="Past Reservations"
              avatar={<History color="primary" />}
              titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
            />
            <CardContent>
              {pastReservations.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No past reservations
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Seat</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Floor</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Time Slot</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pastReservations.map((reservation) => (
                        <TableRow key={reservation._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {reservation.seatId?.seatNumber || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={reservation.seatId?.area || "Unknown"}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <CalendarToday fontSize="small" color="action" />
                              <Typography variant="body2">
                                {new Date(
                                  reservation.date
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2">
                                {reservation.timeSlot}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={reservation.status}
                              color={
                                reservation.status === "Completed"
                                  ? "success"
                                  : "default"
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default InternDashboard;
