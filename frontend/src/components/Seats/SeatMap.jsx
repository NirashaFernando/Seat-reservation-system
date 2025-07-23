import React, { useState, useEffect } from "react";
import { seatsAPI, reservationsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SeatMap = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState("");
  const [filterArea, setFilterArea] = useState("all");
  const { user } = useAuth();

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
    fetchSeats();
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await seatsAPI.getAll();
      setSeats(response.data);
    } catch (error) {
      setError("Failed to fetch seats");
      console.error("Error fetching seats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status === "available") {
      setSelectedSeat(seat);
    }
  };

  const handleReserveSeat = async () => {
    if (!selectedSeat || !selectedDate || !selectedTimeSlot) {
      alert("Please select a seat, date, and time slot");
      return;
    }

    setReserving(true);
    try {
      await reservationsAPI.create({
        userId: user._id || user.id,
        seatId: selectedSeat._id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      });

      alert("Seat reserved successfully!");
      setSelectedSeat(null);
      fetchSeats();
    } catch (error) {
      alert(
        "Failed to reserve seat: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setReserving(false);
    }
  };

  const groupSeatsByArea = (seats) => {
    return seats.reduce((acc, seat) => {
      if (!acc[seat.area]) {
        acc[seat.area] = [];
      }
      acc[seat.area].push(seat);
      return acc;
    }, {});
  };

  const getSeatClass = (seat) => {
    let baseClass = "seat-base";
    if (seat.status === "reserved") {
      baseClass += " seat-occupied";
    } else if (seat.status === "available") {
      baseClass += " seat-available";
    }
    if (selectedSeat?._id === seat._id) {
      baseClass += " seat-selected";
    }
    return baseClass;
  };

  const filteredSeats =
    filterArea === "all"
      ? seats
      : seats.filter((seat) => seat.area === filterArea);

  const seatsByArea = groupSeatsByArea(filteredSeats);
  const areas = [...new Set(seats.map((seat) => seat.area))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-xl text-gray-600">Loading seats...</div>
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
          Seat Reservation
        </h2>
        <p className="text-gray-600">
          Select a seat, date, and time slot to make a reservation
        </p>
      </div>

      {/* Reservation Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Area
            </label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Areas</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={
                new Date(new Date().setDate(new Date().getDate() + 1))
                  .toISOString()
                  .split("T")[0]
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Slot
            </label>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select Time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleReserveSeat}
              disabled={
                !selectedSeat || !selectedDate || !selectedTimeSlot || reserving
              }
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reserving ? "Reserving..." : "Reserve Seat"}
            </button>
          </div>
        </div>

        {selectedSeat && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-900 mb-2">Selected Seat</h4>
            <p className="text-blue-800">
              <strong>Seat:</strong> {selectedSeat.seatNumber} |
              <strong> Area:</strong> {selectedSeat.area} |
              <strong> Location:</strong> {selectedSeat.location}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Selected</span>
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <div className="space-y-8">
        {Object.entries(seatsByArea).map(([area, areaSeats]) => (
          <div key={area} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{area}</h3>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2">
              {areaSeats
                .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
                .map((seat) => (
                  <button
                    key={seat._id}
                    onClick={() => handleSeatClick(seat)}
                    className={getSeatClass(seat)}
                    disabled={seat.status === "reserved"}
                    title={`Seat ${seat.seatNumber} - ${seat.location} (${seat.status})`}
                  >
                    {seat.seatNumber}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {seats.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No seats available</p>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
