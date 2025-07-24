import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import {
  seatsAPI,
  reservationsAPI,
  authAPI,
  getUser,
  isAuthenticated,
} from "../../../utils/api";

export const useAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Dialog and form states
  const [seatDialog, setSeatDialog] = useState({
    open: false,
    mode: "add",
    seat: null,
  });
  const [assignDialog, setAssignDialog] = useState({ open: false, seat: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, seat: null });

  // Form data
  const [seatForm, setSeatForm] = useState({
    seatNumber: "",
    row: "",
    area: "Floor 1",
    location: "Main Hall",
    status: "Available",
  });
  const [assignForm, setAssignForm] = useState({
    internEmail: "",
    date: new Date(),
    timeSlot: "9:00 AM - 12:00 PM",
  });

  // Filter states
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [internFilter, setInternFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const areas = ["Floor 1", "Floor 2", "Floor 3"];
  const timeSlots = [
    "9:00 AM - 12:00 PM",
    "12:00 PM - 3:00 PM",
    "3:00 PM - 6:00 PM",
    "Full Day (9:00 AM - 6:00 PM)",
  ];

  // Function to get dynamic seat status based on reservations
  const getSeatStatus = (seat) => {
    const today = new Date().toDateString();
    const hasActiveReservation = reservations.some(
      (reservation) =>
        reservation.seatId?._id === seat._id &&
        reservation.status === "Active" &&
        new Date(reservation.date).toDateString() === today
    );
    return hasActiveReservation ? "Occupied" : "Available";
  };

  // Function to get seats with dynamic status
  const getSeatsWithDynamicStatus = () => {
    return seats.map((seat) => ({
      ...seat,
      dynamicStatus: getSeatStatus(seat),
    }));
  };

  const groupSeatsByArea = (seats) => {
    return seats.reduce((groups, seat) => {
      const area = seat.area;
      if (!groups[area]) {
        groups[area] = [];
      }
      groups[area].push(seat);
      return groups;
    }, {});
  };

  // Data fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [seatsRes, reservationsRes] = await Promise.all([
        seatsAPI.getAll(),
        reservationsAPI.getAll(),
      ]);

      setSeats(seatsRes.data || []);
      setReservations(reservationsRes.data || []);

      // Calculate stats
      const seatsData = seatsRes.data || [];
      const reservationsData = reservationsRes.data || [];
      const totalSeats = seatsData.length;
      const today = new Date().toDateString();

      const occupiedSeats = seatsData.filter((seat) => {
        return reservationsData.some(
          (reservation) =>
            reservation.seatId?._id === seat._id &&
            reservation.status === "Active" &&
            new Date(reservation.date).toDateString() === today
        );
      }).length;

      const availableSeats = totalSeats - occupiedSeats;

      setStats({
        totalSeats,
        availableSeats,
        occupiedSeats,
        totalReservations: reservationsData.length,
        activeReservations: reservationsData.filter(
          (r) => r.status === "Active"
        ).length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Seat Management Functions
  const handleAddSeat = () => {
    setSeatForm({
      seatNumber: "",
      row: "",
      area: "Floor 1",
      location: "Main Hall",
      status: "Available",
    });
    setSeatDialog({ open: true, mode: "add", seat: null });
  };

  const handleEditSeat = (seat) => {
    setSeatForm({
      seatNumber: seat.seatNumber,
      row: seat.row || "",
      area: seat.area,
      location: seat.location || "Main Hall",
      status: seat.status,
    });
    setSeatDialog({ open: true, mode: "edit", seat });
  };

  const handleDeleteSeat = (seat) => {
    setDeleteDialog({ open: true, seat });
  };

  const handleSeatFormSubmit = async () => {
    try {
      if (seatDialog.mode === "add") {
        await seatsAPI.create(seatForm);
        setSuccess("Seat added successfully!");
      } else {
        await seatsAPI.updateSeat(seatDialog.seat._id, seatForm);
        setSuccess("Seat updated successfully!");
      }
      setError("");
      setOpenSnackbar(true);
      setSeatDialog({ open: false, mode: "add", seat: null });
      await fetchData();
    } catch (error) {
      setError(
        `Failed to ${seatDialog.mode} seat: ${
          error.response?.data?.message || error.message
        }`
      );
      setSuccess("");
      setOpenSnackbar(true);
    }
  };

  const handleSeatDelete = async () => {
    try {
      await seatsAPI.delete(deleteDialog.seat._id);
      setDeleteDialog({ open: false, seat: null });
      setSuccess("Seat deleted successfully!");
      setError("");
      setOpenSnackbar(true);
      await fetchData();
    } catch (error) {
      setError(
        `Failed to delete seat: ${
          error.response?.data?.message || error.message
        }`
      );
      setSuccess("");
      setOpenSnackbar(true);
    }
  };

  // Manual Assignment Function
  const handleManualAssign = (seat) => {
    setAssignForm({
      internEmail: "",
      date: new Date(),
      timeSlot: "9:00 AM - 12:00 PM",
    });
    setAssignDialog({ open: true, seat });
  };

  const handleAssignmentSubmit = async () => {
    try {
      const assignmentData = {
        seatId: assignDialog.seat._id,
        internEmail: assignForm.internEmail,
        date: assignForm.date,
        timeSlot: assignForm.timeSlot,
      };

      await reservationsAPI.manualAssign(assignmentData);
      setAssignDialog({ open: false, seat: null });
      setSuccess("Seat assigned successfully!");
      setError("");
      setOpenSnackbar(true);
      await fetchData();
    } catch (error) {
      setError(
        `Failed to assign seat: ${
          error.response?.data?.message || error.message
        }`
      );
      setSuccess("");
      setOpenSnackbar(true);
    }
  };

  // Filter Functions
  const applyFilters = () => {
    let filtered = [...reservations];

    if (dateFilter) {
      filtered = filtered.filter(
        (r) => new Date(r.date).toDateString() === dateFilter.toDateString()
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (internFilter) {
      filtered = filtered.filter(
        (r) =>
          r.userId?.name?.toLowerCase().includes(internFilter.toLowerCase()) ||
          r.userId?.email?.toLowerCase().includes(internFilter.toLowerCase())
      );
    }

    setFilteredReservations(filtered);
  };

  const clearFilters = () => {
    setDateFilter(null);
    setStatusFilter("");
    setInternFilter("");
    setFilteredReservations(reservations);
  };

  // Report Generation Function
  const generateReport = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Report data
      const reportData = {
        totalSeats: stats.totalSeats,
        availableSeats: stats.availableSeats,
        occupiedSeats: stats.occupiedSeats,
        totalReservations: stats.totalReservations,
        activeReservations: stats.activeReservations,
        utilizationRate: (
          (stats.occupiedSeats / stats.totalSeats) *
          100
        ).toFixed(2),
        reservationsByArea: {},
        reservationsByTimeSlot: {},
        generatedAt: new Date().toLocaleString(),
      };

      // Calculate reservations by area
      reservations.forEach((r) => {
        const area = r.seatId?.area || "Unknown";
        reportData.reservationsByArea[area] =
          (reportData.reservationsByArea[area] || 0) + 1;
      });

      // Calculate reservations by time slot
      reservations.forEach((r) => {
        const slot = r.timeSlot || "Unknown";
        reportData.reservationsByTimeSlot[slot] =
          (reportData.reservationsByTimeSlot[slot] || 0) + 1;
      });

      let yPosition = 20;
      const lineHeight = 7;
      const sectionSpacing = 15;

      // Header
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("Seat Reservation System Report", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Generated on: ${reportData.generatedAt}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += sectionSpacing;

      // Overview Section
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Overview", 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const overviewData = [
        `Total Seats: ${reportData.totalSeats}`,
        `Available Seats: ${reportData.availableSeats}`,
        `Occupied Seats: ${reportData.occupiedSeats}`,
        `Utilization Rate: ${reportData.utilizationRate}%`,
        `Total Reservations: ${reportData.totalReservations}`,
        `Active Reservations: ${reportData.activeReservations}`,
      ];

      overviewData.forEach((item) => {
        pdf.text(item, 30, yPosition);
        yPosition += lineHeight;
      });
      yPosition += sectionSpacing;

      // Reservations by Floor Section
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Reservations by Floor", 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      Object.entries(reportData.reservationsByArea).forEach(([area, count]) => {
        pdf.text(`${area}: ${count} reservations`, 30, yPosition);
        yPosition += lineHeight;
      });
      yPosition += sectionSpacing;

      // Recent Reservations Section
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += sectionSpacing;
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Recent Reservations (Last 10)", 20, yPosition);
      yPosition += 10;

      // Footer
      const footerY = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "italic");
      pdf.text(
        "Generated by Seat Reservation System Admin Dashboard",
        pageWidth / 2,
        footerY,
        { align: "center" }
      );

      // Save the PDF
      const fileName = `seat-usage-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      setSuccess("PDF report generated successfully!");
      setError("");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error generating PDF report:", error);
      setError("Failed to generate PDF report");
      setSuccess("");
      setOpenSnackbar(true);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/");
  };

  // Effects
  useEffect(() => {
    const user = getUser();
    if (!isAuthenticated() || user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [reservations, dateFilter, statusFilter, internFilter]);

  return {
    // State
    activeTab,
    setActiveTab,
    seats,
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
    getSeatStatus,
    getSeatsWithDynamicStatus,
    groupSeatsByArea,
    fetchData,
    handleAddSeat,
    handleEditSeat,
    handleDeleteSeat,
    handleSeatFormSubmit,
    handleSeatDelete,
    handleManualAssign,
    handleAssignmentSubmit,
    applyFilters,
    clearFilters,
    generateReport,
    handleLogout,
  };
};
