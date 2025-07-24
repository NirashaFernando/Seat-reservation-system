import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import { EventSeat, CheckCircle, Cancel, History } from "@mui/icons-material";

const OverviewTab = ({ stats, reservations }) => {
  return (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventSeat color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalSeats}
                </Typography>
                <Typography color="text.secondary">Total Seats</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.availableSeats}
                </Typography>
                <Typography color="text.secondary">Available</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Cancel color="error" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {stats.occupiedSeats}
                </Typography>
                <Typography color="text.secondary">Occupied Today</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Reservations */}
      <Grid size={{ xs: 12 }}>
        <Card elevation={2}>
          <CardHeader
            title="Recent Reservations"
            avatar={<History color="primary" />}
            titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
          />
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>User</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Seat</strong>
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
                  {reservations.slice(0, 10).map((reservation) => (
                    <TableRow key={reservation._id} hover>
                      <TableCell>{reservation.userId?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${reservation.seatId?.seatNumber || "N/A"} (${
                            reservation.seatId?.area || "Unknown"
                          })`}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(reservation.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{reservation.timeSlot || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={reservation.status || "Unknown"}
                          color={
                            reservation.status === "Active"
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
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OverviewTab;
