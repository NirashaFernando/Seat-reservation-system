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
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TablePagination,
} from "@mui/material";
import {
  History,
  FilterList,
  Refresh,
  CalendarToday,
  Schedule,
} from "@mui/icons-material";

const ReservationsTab = ({
  filteredReservations,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  internFilter,
  setInternFilter,
  clearFilters,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
}) => {
  return (
    <>
      {/* Filter Section */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardHeader
          title="Filter Reservations"
          avatar={<FilterList color="primary" />}
          action={
            <Button
              variant="outlined"
              onClick={clearFilters}
              startIcon={<Refresh />}
            >
              Clear Filters
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                type="date"
                label="Filter by Date"
                value={dateFilter ? dateFilter.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setDateFilter(
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Search Intern"
                value={internFilter}
                onChange={(e) => setInternFilter(e.target.value)}
                placeholder="Name or email..."
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card elevation={2}>
        <CardHeader
          title={`All Reservations (${filteredReservations.length})`}
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
                    <strong>Email</strong>
                  </TableCell>
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
                  <TableCell>
                    <strong>Created</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReservations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((reservation) => (
                    <TableRow key={reservation._id} hover>
                      <TableCell>{reservation.userId?.name || "N/A"}</TableCell>
                      <TableCell>
                        {reservation.userId?.email || "N/A"}
                      </TableCell>
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
                            {new Date(reservation.date).toLocaleDateString()}
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
                            {reservation.timeSlot || "N/A"}
                          </Typography>
                        </Box>
                      </TableCell>
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
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(reservation.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredReservations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ReservationsTab;
