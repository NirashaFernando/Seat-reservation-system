require("dotenv").config();
const mongoose = require("mongoose");
const Seat = require("./models/seat");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Example seat map data
const sampleSeats = [
  // Front Row (Row A)
  {
    seatNumber: "A1",
    row: "A",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "A2",
    row: "A",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "A3",
    row: "A",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "A4",
    row: "A",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "A5",
    row: "A",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "A6",
    row: "A",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "A7",
    row: "A",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "A8",
    row: "A",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },

  // Row B
  {
    seatNumber: "B1",
    row: "B",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "B2",
    row: "B",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "B3",
    row: "B",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "B4",
    row: "B",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "B5",
    row: "B",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "B6",
    row: "B",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "B7",
    row: "B",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "B8",
    row: "B",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },

  // Row C
  {
    seatNumber: "C1",
    row: "C",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "C2",
    row: "C",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "C3",
    row: "C",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "C4",
    row: "C",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "C5",
    row: "C",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "C6",
    row: "C",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "C7",
    row: "C",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "C8",
    row: "C",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },

  // Row D
  {
    seatNumber: "D1",
    row: "D",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "D2",
    row: "D",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "D3",
    row: "D",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "D4",
    row: "D",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "D5",
    row: "D",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "D6",
    row: "D",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "D7",
    row: "D",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "D8",
    row: "D",
    location: "Main Hall",
    area: "Floor 1",
    status: "Available",
  },

  // VIP Section - Floor 2
  {
    seatNumber: "V1",
    row: "V",
    location: "VIP Section",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "V2",
    row: "V",
    location: "VIP Section",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "V3",
    row: "V",
    location: "VIP Section",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "V4",
    row: "V",
    location: "VIP Section",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "V5",
    row: "V",
    location: "VIP Section",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "V6",
    row: "V",
    location: "VIP Section",
    area: "Floor 2",
    status: "Available",
  },

  // Balcony Section
  {
    seatNumber: "BAL1",
    row: "BAL",
    location: "Balcony",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "BAL2",
    row: "BAL",
    location: "Balcony",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "BAL3",
    row: "BAL",
    location: "Balcony",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "BAL4",
    row: "BAL",
    location: "Balcony",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "BAL5",
    row: "BAL",
    location: "Balcony",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "BAL6",
    row: "BAL",
    location: "Balcony",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "BAL7",
    row: "BAL",
    location: "Balcony",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "BAL8",
    row: "BAL",
    location: "Balcony",
    area: "Floor 2",
    status: "Available",
  },

  // Conference Room Seats
  {
    seatNumber: "CR1",
    row: "CR",
    location: "Conference Room A",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "CR2",
    row: "CR",
    location: "Conference Room A",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "CR3",
    row: "CR",
    location: "Conference Room A",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "CR4",
    row: "CR",
    location: "Conference Room A",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "CR5",
    row: "CR",
    location: "Conference Room A",
    area: "Floor 1",
    status: "Available",
  },
  {
    seatNumber: "CR6",
    row: "CR",
    location: "Conference Room A",
    area: "Floor 1",
    status: "Available",
  },
];

const seedSeats = async () => {
  try {
    await connectDB();

    console.log("Clearing existing seats...");
    await Seat.deleteMany({});

    console.log("Seeding sample seats...");
    await Seat.insertMany(sampleSeats);

    console.log(`Successfully seeded ${sampleSeats.length} seats!`);
    console.log("\nSeat Map Layout:");
    console.log("================");
    console.log("Main Hall - Floor 1:");
    console.log("Row A: A1 A2 A3 A4 A5 A6 A7 A8");
    console.log("Row B: B1 B2 B3 B4 B5 B6 B7 B8");
    console.log("Row C: C1 C2 C3 C4 C5 C6 C7 C8");
    console.log("Row D: D1 D2 D3 D4 D5 D6 D7 D8");
    console.log("\nVIP Section - Floor 2:");
    console.log("Row V: V1 V2 V3 V4 V5 V6");
    console.log("\nBalcony - Floor 2:");
    console.log("Row BAL: BAL1 BAL2 BAL3 BAL4 BAL5 BAL6 BAL7 BAL8");
    console.log("\nConference Room A - Floor 1:");
    console.log("Row CR: CR1 CR2 CR3 CR4 CR5 CR6");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding seats:", error);
    process.exit(1);
  }
};

seedSeats();
