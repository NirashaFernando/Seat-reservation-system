import React, { useState, useEffect } from "react";
import { reservationsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed, cancelled
  const [sortBy, setSortBy] = useState("date"); // date, seat, status
  const { user } = useAuth();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await reservationsAPI.getAll();
      // Filter reservations for current user if not admin
      const userReservations =
        user.role === "admin"
          ? response.data
          : response.data.filter(
              (reservation) =>
                reservation.userId === user._id ||
                reservation.userId === user.id
            );
      setReservations(userReservations);
    } catch (error) {
      setError("Failed to fetch reservations");
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      await reservationsAPI.cancel(reservationId);
      alert("Reservation cancelled successfully!");
      fetchReservations(); // Refresh the list
    } catch (error) {
      alert(
        "Failed to cancel reservation: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleModifyReservation = async (
    reservationId,
    newDate,
    newTimeSlot
  ) => {
    try {
      await reservationsAPI.update(reservationId, {
        date: newDate,
        timeSlot: newTimeSlot,
      });
      alert("Reservation modified successfully!");
      fetchReservations();
    } catch (error) {
      alert(
        "Failed to modify reservation: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (filter === "all") return true;
    return reservation.status === filter;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date) - new Date(a.date);
      case "seat":
        return a.seatId?.seatNumber?.localeCompare(b.seatId?.seatNumber) || 0;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const canCancelReservation = (reservation) => {
    const reservationDate = new Date(reservation.date);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    return reservation.status === "active" && reservationDate > oneHourFromNow;
  };

  const canModifyReservation = (reservation) => {
    const reservationDate = new Date(reservation.date);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    return reservation.status === "active" && reservationDate > oneHourFromNow;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-xl text-gray-600">Loading reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {user.role === "admin" ? "All Reservations" : "My Reservations"}
        </h2>
        <p className="text-gray-600">
          {user.role === "admin"
            ? "Manage all user reservations in the system"
            : "View and manage your seat reservations"}
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Reservations</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="seat">Seat Number</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {sortedReservations.length} of {reservations.length}{" "}
            reservations
          </div>
        </div>
      </div>

      {/* Reservations List */}
      {sortedReservations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Reservations Found
          </h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "You haven't made any reservations yet."
              : `No ${filter} reservations found.`}
          </p>
          <a
            href="/seats"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 mt-4"
          >
            Make a Reservation
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReservations.map((reservation) => (
            <div
              key={reservation._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 lg:mb-0">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Seat {reservation.seatId?.seatNumber || "N/A"}
                    </h3>
                    <p className="text-gray-600">
                      {reservation.seatId?.area} -{" "}
                      {reservation.seatId?.location}
                    </p>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Date & Time
                    </div>
                    <div className="font-medium text-gray-900">
                      {new Date(reservation.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reservation.timeSlot || "N/A"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {reservation.status}
                    </span>
                    {user.role === "admin" && (
                      <div className="text-sm text-gray-600 mt-1">
                        User:{" "}
                        {reservation.userId?.name ||
                          reservation.userId?.email ||
                          "N/A"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {canModifyReservation(reservation) && (
                    <button
                      onClick={() => {
                        const newDate = prompt(
                          "Enter new date (YYYY-MM-DD):",
                          reservation.date.split("T")[0]
                        );
                        const newTimeSlot = prompt(
                          "Enter new time slot:",
                          reservation.timeSlot
                        );
                        if (newDate && newTimeSlot) {
                          handleModifyReservation(
                            reservation._id,
                            newDate,
                            newTimeSlot
                          );
                        }
                      }}
                      className="px-3 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 text-sm font-medium transition-colors"
                    >
                      Modify
                    </button>
                  )}

                  {canCancelReservation(reservation) && (
                    <button
                      onClick={() => handleCancelReservation(reservation._id)}
                      className="px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {reservation.status === "active" &&
                    !canCancelReservation(reservation) && (
                      <div className="text-xs text-gray-500 px-3 py-2">
                        Cannot modify (less than 1 hour)
                      </div>
                    )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    Reserved on:{" "}
                    {new Date(reservation.createdAt).toLocaleString()}
                  </div>
                  {reservation.updatedAt !== reservation.createdAt && (
                    <div>
                      Last updated:{" "}
                      {new Date(reservation.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationHistory;
