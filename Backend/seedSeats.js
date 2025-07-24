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

// Floor-based seat map data
const sampleSeats = [
  // FLOOR 1 - Rows A, B, C, D
  // Row A - Floor 1
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

  // Row B - Floor 1
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

  // Row C - Floor 1
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

  // Row D - Floor 1
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

  // FLOOR 2 - Rows E, F, G, H
  // Row E - Floor 2
  {
    seatNumber: "E1",
    row: "E",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "E2",
    row: "E",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "E3",
    row: "E",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "E4",
    row: "E",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "E5",
    row: "E",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "E6",
    row: "E",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "E7",
    row: "E",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "E8",
    row: "E",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },

  // Row F - Floor 2
  {
    seatNumber: "F1",
    row: "F",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "F2",
    row: "F",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "F3",
    row: "F",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "F4",
    row: "F",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "F5",
    row: "F",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "F6",
    row: "F",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "F7",
    row: "F",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "F8",
    row: "F",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },

  // Row G - Floor 2
  {
    seatNumber: "G1",
    row: "G",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "G2",
    row: "G",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "G3",
    row: "G",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "G4",
    row: "G",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "G5",
    row: "G",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "G6",
    row: "G",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "G7",
    row: "G",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "G8",
    row: "G",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },

  // Row H - Floor 2
  {
    seatNumber: "H1",
    row: "H",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "H2",
    row: "H",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "H3",
    row: "H",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "H4",
    row: "H",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "H5",
    row: "H",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "H6",
    row: "H",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "H7",
    row: "H",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },
  {
    seatNumber: "H8",
    row: "H",
    location: "Main Hall",
    area: "Floor 2",
    status: "Available",
  },

  // FLOOR 3 - Rows I, J, K, L
  // Row I - Floor 3
  {
    seatNumber: "I1",
    row: "I",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "I2",
    row: "I",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "I3",
    row: "I",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "I4",
    row: "I",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "I5",
    row: "I",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "I6",
    row: "I",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "I7",
    row: "I",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "I8",
    row: "I",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },

  // Row J - Floor 3
  {
    seatNumber: "J1",
    row: "J",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "J2",
    row: "J",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "J3",
    row: "J",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "J4",
    row: "J",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "J5",
    row: "J",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "J6",
    row: "J",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "J7",
    row: "J",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "J8",
    row: "J",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },

  // Row K - Floor 3
  {
    seatNumber: "K1",
    row: "K",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "K2",
    row: "K",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "K3",
    row: "K",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "K4",
    row: "K",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "K5",
    row: "K",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "K6",
    row: "K",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "K7",
    row: "K",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "K8",
    row: "K",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },

  // Row L - Floor 3
  {
    seatNumber: "L1",
    row: "L",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "L2",
    row: "L",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "L3",
    row: "L",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "L4",
    row: "L",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "L5",
    row: "L",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "L6",
    row: "L",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "L7",
    row: "L",
    location: "Main Hall",
    area: "Floor 3",
    status: "Available",
  },
  {
    seatNumber: "L8",
    row: "L",
    location: "Main Hall",
    area: "Floor 3",
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
    console.log("Floor 1 - Main Hall:");
    console.log("Row A: A1 A2 A3 A4 A5 A6 A7 A8");
    console.log("Row B: B1 B2 B3 B4 B5 B6 B7 B8");
    console.log("Row C: C1 C2 C3 C4 C5 C6 C7 C8");
    console.log("Row D: D1 D2 D3 D4 D5 D6 D7 D8");
    console.log("\nFloor 2 - Main Hall:");
    console.log("Row E: E1 E2 E3 E4 E5 E6 E7 E8");
    console.log("Row F: F1 F2 F3 F4 F5 F6 F7 F8");
    console.log("Row G: G1 G2 G3 G4 G5 G6 G7 G8");
    console.log("Row H: H1 H2 H3 H4 H5 H6 H7 H8");
    console.log("\nFloor 3 - Main Hall:");
    console.log("Row I: I1 I2 I3 I4 I5 I6 I7 I8");
    console.log("Row J: J1 J2 J3 J4 J5 J6 J7 J8");
    console.log("Row K: K1 K2 K3 K4 K5 K6 K7 K8");
    console.log("Row L: L1 L2 L3 L4 L5 L6 L7 L8");
    console.log(`\nTotal Seats: ${sampleSeats.length}`);
    console.log("Floor 1: 32 seats (A-D rows)");
    console.log("Floor 2: 32 seats (E-H rows)");
    console.log("Floor 3: 32 seats (I-L rows)");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding seats:", error);
    process.exit(1);
  }
};

seedSeats();
