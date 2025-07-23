import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  seatsAPI,
  reservationsAPI,
  authAPI,
  getUser,
  isAuthenticated,
  formatDate,
  formatTime,
} from "../../utils/api";

const InternDashboard = () => {
  const [activeTab, setActiveTab] = useState("book");
  const [seats, setSeats] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [currentReservations, setCurrentReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notification, setNotification] = useState(null); // For popup notifications
  const navigate = useNavigate();

  const timeSlots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
  ];

  useEffect(() => {
    const user = getUser();
    if (!isAuthenticated() || user?.role !== "intern") {
      navigate("/");
      return;
    }
    fetchData();
  }, [navigate]);

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Update seat availability when date or time slot changes
  useEffect(() => {
    if (selectedDate && selectedTimeSlot && seats.length > 0) {
      updateSeatAvailability();
    }
  }, [selectedDate, selectedTimeSlot, currentReservations]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const updateSeatAvailability = () => {
    const updatedSeats = seats.map(seat => {
      // Check if this seat is reserved for the selected date and time slot
      const isReserved = currentReservations.some(reservation => 
        reservation.seat?._id === seat._id &&
        reservation.date === selectedDate &&
        reservation.timeSlot === selectedTimeSlot
      );

      return {
        ...seat,
        status: isReserved ? "reserved" : seat.originalStatus || "Available"
      };
    });

    setSeats(updatedSeats);
  };

  // Refresh seats when date changes
  useEffect(() => {
    if (selectedDate) {
      const fetchSeats = async () => {
        try {
          // Fetch seats for the entire day when only date is selected
          console.log("Fetching seats for date:", selectedDate);
          const seatsRes = await seatsAPI.getAll(selectedDate, "");
          console.log("Seats received:", seatsRes.data);
          setSeats(seatsRes.data);
        } catch (error) {
          console.error("Error fetching seats:", error);
        }
      };
      fetchSeats();
    }
  }, [selectedDate]);

  // Update seat availability when time slot is selected
  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      const fetchSeatsWithTimeSlot = async () => {
        try {
          console.log(
            "Fetching seats for date and time:",
            selectedDate,
            selectedTimeSlot
          );
          const seatsRes = await seatsAPI.getAll(
            selectedDate,
            selectedTimeSlot
          );
          console.log("Seats with time slot:", seatsRes.data);
          setSeats(seatsRes.data);
        } catch (error) {
          console.error("Error fetching seats with time slot:", error);
        }
      };
      fetchSeatsWithTimeSlot();
    }
  }, [selectedTimeSlot]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      
      const [seatsRes, reservationsRes, currentRes, pastRes] = await Promise.all([
        seatsAPI.getAll(selectedDate, ""),
        reservationsAPI.getUserReservations(),
        reservationsAPI.getCurrentReservations(),
        reservationsAPI.getPastReservations(),
      ]);

      // Store original status for seat availability updates
      const seatsWithOriginalStatus = seatsRes.data.map(seat => ({
        ...seat,
        originalStatus: seat.status
      }));

      setSeats(seatsWithOriginalStatus);
      setMyReservations(reservationsRes.data);
      setCurrentReservations(currentRes.data);
      setPastReservations(pastRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      
      // Provide more specific error messages
      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        navigate("/");
      } else if (error.response?.status === 403) {
        setError("Access denied. You don't have permission to view this data.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError("Unable to connect to server. Please check your connection and try again.");
      } else {
        setError(error.response?.data?.error || error.response?.data?.message || "Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/");
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedSeat(null); // Clear seat selection when date changes
    setSelectedTimeSlot(""); // Clear time slot when date changes
  };

  const handleTimeSlotChange = (newTimeSlot) => {
    setSelectedTimeSlot(newTimeSlot);
    setSelectedSeat(null); // Clear seat selection when time slot changes
  };

  const handleSeatSelection = (seat) => {
    if (seat.status === "Available") {
      setSelectedSeat(seat);
    }
  };

  const handleBooking = async () => {
    if (!selectedSeat || !selectedDate || !selectedTimeSlot) {
      showNotification("Please select a seat, date, and time slot", "error");
      return;
    }

    // Debug logging
    console.log("Booking attempt:", {
      seatId: selectedSeat._id,
      seatNumber: selectedSeat.seatNumber,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      dateObject: new Date(selectedDate),
      now: new Date(),
    });

    try {
      setBookingLoading(true);
      setError("");

      const response = await reservationsAPI.create({
        seatId: selectedSeat._id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      });

      console.log("Booking response:", response.data);
      showNotification(`Seat ${selectedSeat.seatNumber} booked successfully!`, "success");
      setSelectedSeat(null);
      setSelectedDate(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });
      setSelectedTimeSlot("");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Booking error:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to book seat";
      showNotification(errorMessage, "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      await reservationsAPI.cancel(reservationId);
      showNotification("Reservation cancelled successfully!", "success");
      fetchData(); // Refresh data
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to cancel reservation";
      showNotification(errorMessage, "error");
    }
  };

  const getSeatColor = (seat) => {
    // Selected seat
    if (selectedSeat?._id === seat._id) {
      return "bg-blue-100 border-blue-400 text-blue-800 ring-2 ring-blue-300 shadow-md";
    }

    // Check seat status
    if (
      seat.status === "Unavailable" ||
      seat.status === "occupied" ||
      seat.status === "reserved"
    ) {
      return "bg-red-50 border-red-300 text-red-700 cursor-not-allowed opacity-70";
    }

    if (seat.status === "Available") {
      return "bg-green-50 border-green-300 text-green-800 hover:bg-green-100 hover:border-green-400 cursor-pointer shadow-sm hover:shadow-md";
    }

    // Default for other statuses
    return "bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-70";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Popup Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`max-w-sm p-4 rounded-lg shadow-lg border-l-4 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-400 text-green-800'
              : 'bg-red-50 border-red-400 text-red-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Seat Reservation System
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{getUser()?.name}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: "book", name: "Book Seat" },
              { id: "current", name: "Current Reservations" },
              { id: "past", name: "Past Reservations" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Book Seat Tab */}
        {activeTab === "book" && (
          <div className="space-y-6">
            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Book a Seat
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time Slot
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => handleTimeSlotChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Seat
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
                    {selectedSeat
                      ? `${selectedSeat.seatNumber} (${selectedSeat.area})`
                      : "No seat selected"}
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleBooking}
                    disabled={
                      !selectedSeat ||
                      !selectedDate ||
                      !selectedTimeSlot ||
                      bookingLoading
                    }
                    className="w-full py-2 px-4 rounded-md font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? "Booking..." : "Book Seat"}
                  </button>
                </div>
              </div>
            </div>

            {/* Seat Map */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select a Seat
                </h3>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-50 border-2 border-green-300 rounded mr-2"></div>
                    <span className="text-gray-700 font-medium">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-red-50 border-2 border-red-300 rounded mr-2"></div>
                    <span className="text-gray-700 font-medium">
                      Unavailable
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-blue-100 border-2 border-blue-400 rounded mr-2"></div>
                    <span className="text-gray-700 font-medium">Selected</span>
                  </div>
                </div>
              </div>

              {Object.entries(groupSeatsByArea(seats)).map(
                ([area, areaSeats]) => (
                  <div key={area} className="mb-8">
                    <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
                      <h4 className="text-md font-semibold text-gray-800 capitalize">
                        {area} Area ({areaSeats.length} seats)
                      </h4>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-3">
                      {areaSeats.map((seat) => (
                        <button
                          key={seat._id}
                          onClick={() => handleSeatSelection(seat)}
                          disabled={seat.status !== "Available"}
                          className={`p-3 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 border-2 ${getSeatColor(
                            seat
                          )}`}
                          title={`Seat ${seat.seatNumber} - ${seat.status}`}
                        >
                          {seat.seatNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Current Reservations Tab */}
        {activeTab === "current" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Current Reservations
              </h3>
            </div>
            <div className="p-6">
              {currentReservations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No current reservations</p>
                  <button
                    onClick={() => setActiveTab("book")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Book a Seat
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentReservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                Seat {reservation.seat?.seatNumber}
                              </h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {reservation.seat?.area} Area
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">
                                Date:
                              </span>
                              <p className="text-gray-900">
                                {formatDate(reservation.date)}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Time:
                              </span>
                              <p className="text-gray-900">
                                {reservation.timeSlot}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Status:
                              </span>
                              <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {reservation.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {reservation.status === "Active" &&
                          new Date(reservation.date) > new Date() && (
                            <button
                              onClick={() =>
                                handleCancelReservation(reservation._id)
                              }
                              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Past Reservations Tab */}
        {activeTab === "past" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Past Reservations
              </h3>
            </div>
            <div className="p-6">
              {pastReservations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No past reservations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastReservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="border border-gray-200 rounded-lg p-4 opacity-75"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                Seat {reservation.seat?.seatNumber}
                              </h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {reservation.seat?.area} Area
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">
                                Date:
                              </span>
                              <p className="text-gray-900">
                                {formatDate(reservation.date)}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Time:
                              </span>
                              <p className="text-gray-900">
                                {reservation.timeSlot}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Status:
                              </span>
                              <span
                                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  reservation.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {reservation.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InternDashboard;
