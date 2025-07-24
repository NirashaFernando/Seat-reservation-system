import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  AdminPanelSettings,
  ExitToApp,
  Dashboard,
  EventSeat,
  History,
  Assignment,
  Assessment,
} from "@mui/icons-material";
import { getUser } from "../../utils/api";

// Import components
import TabPanel from "./components/TabPanel";
import OverviewTab from "./components/OverviewTab";
import SeatManagementTab from "./components/SeatManagementTab";
import ReservationsTab from "./components/ReservationsTab";
import ManualAssignmentTab from "./components/ManualAssignmentTab";
import ReportsTab from "./components/ReportsTab";
import AdminDialogs from "./components/AdminDialogs";

// Import custom hook
import { useAdminDashboard } from "./hooks/useAdminDashboard";

const AdminDashboard = () => {
  const {
    // State
    activeTab,
    setActiveTab,
    reservations,
    filteredReservations,
    stats,
    loading,
    error,
    success,
    openSnackbar,
    setOpenSnackbar,
    seatDialog,
    setSeatDialog,
    assignDialog,
    setAssignDialog,
    deleteDialog,
    setDeleteDialog,
    seatForm,
    setSeatForm,
    assignForm,
    setAssignForm,
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter,
    internFilter,
    setInternFilter,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    areas,
    timeSlots,

    // Functions
    getSeatsWithDynamicStatus,
    groupSeatsByArea,
    handleAddSeat,
    handleEditSeat,
    handleDeleteSeat,
    handleSeatFormSubmit,
    handleSeatDelete,
    handleManualAssign,
    handleAssignmentSubmit,
    clearFilters,
    generateReport,
    handleLogout,
  } = useAdminDashboard();

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
          Loading admin dashboard...
        </Typography>
      </Box>
    );
  }

  const groupedSeats = groupSeatsByArea(getSeatsWithDynamicStatus());

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
    >
      {/* App Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <AdminPanelSettings sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard - Seat Reservation System
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <AdminPanelSettings sx={{ mr: 1 }} />
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
            aria-label="admin dashboard tabs"
            sx={{ minHeight: 64 }}
          >
            <Tab
              label="Overview"
              value="overview"
              icon={<Dashboard />}
              iconPosition="start"
              sx={{ minHeight: 64, fontSize: "1rem" }}
            />
            <Tab
              label="Seat Management"
              value="seats"
              icon={<EventSeat />}
              iconPosition="start"
              sx={{ minHeight: 64, fontSize: "1rem" }}
            />
            <Tab
              label="Reservations"
              value="reservations"
              icon={<History />}
              iconPosition="start"
              sx={{ minHeight: 64, fontSize: "1rem" }}
            />
            <Tab
              label="Manual Assignment"
              value="assignment"
              icon={<Assignment />}
              iconPosition="start"
              sx={{ minHeight: 64, fontSize: "1rem" }}
            />
            <Tab
              label="Reports"
              value="reports"
              icon={<Assessment />}
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

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tab Panels */}
        <TabPanel value={activeTab} index="overview">
          <OverviewTab stats={stats} reservations={reservations} />
        </TabPanel>

        <TabPanel value={activeTab} index="seats">
          <SeatManagementTab
            groupedSeats={groupedSeats}
            handleAddSeat={handleAddSeat}
            handleManualAssign={handleManualAssign}
            handleEditSeat={handleEditSeat}
            handleDeleteSeat={handleDeleteSeat}
          />
        </TabPanel>

        <TabPanel value={activeTab} index="reservations">
          <ReservationsTab
            filteredReservations={filteredReservations}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            internFilter={internFilter}
            setInternFilter={setInternFilter}
            clearFilters={clearFilters}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </TabPanel>

        <TabPanel value={activeTab} index="assignment">
          <ManualAssignmentTab
            groupedSeats={groupedSeats}
            handleManualAssign={handleManualAssign}
          />
        </TabPanel>

        <TabPanel value={activeTab} index="reports">
          <ReportsTab stats={stats} generateReport={generateReport} />
        </TabPanel>
      </Container>

      {/* Dialogs */}
      <AdminDialogs
        seatDialog={seatDialog}
        setSeatDialog={setSeatDialog}
        seatForm={seatForm}
        setSeatForm={setSeatForm}
        handleSeatFormSubmit={handleSeatFormSubmit}
        deleteDialog={deleteDialog}
        setDeleteDialog={setDeleteDialog}
        handleSeatDelete={handleSeatDelete}
        assignDialog={assignDialog}
        setAssignDialog={setAssignDialog}
        assignForm={assignForm}
        setAssignForm={setAssignForm}
        handleAssignmentSubmit={handleAssignmentSubmit}
        areas={areas}
        timeSlots={timeSlots}
      />
    </Box>
  );
};

export default AdminDashboard;
