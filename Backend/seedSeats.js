const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Seat = require("./models/seat");

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedSeats = async () => {
  try {
    // Connect to database first
    await connectDB();

    // Clear existing seats
    await Seat.deleteMany({});
    console.log("🗑️ Cleared existing seats");

    const seats = [];

    // Floor 1: Rows A-D (32 seats)
    const floor1Rows = ["A", "B", "C", "D"];
    for (const row of floor1Rows) {
      for (let seatNum = 1; seatNum <= 8; seatNum++) {
        seats.push({
          seatNumber: `${row}${seatNum}`,
          row: row,
          location: "Main Hall",
          area: "Floor 1",
          status: "Available",
        });
      }
    }

    // Floor 2: Rows E-H (32 seats)
    const floor2Rows = ["E", "F", "G", "H"];
    for (const row of floor2Rows) {
      for (let seatNum = 1; seatNum <= 8; seatNum++) {
        seats.push({
          seatNumber: `${row}${seatNum}`,
          row: row,
          location: "Main Hall",
          area: "Floor 2",
          status: "Available",
        });
      }
    }

    // Floor 3: Rows I-L (32 seats)
    const floor3Rows = ["I", "J", "K", "L"];
    for (const row of floor3Rows) {
      for (let seatNum = 1; seatNum <= 8; seatNum++) {
        seats.push({
          seatNumber: `${row}${seatNum}`,
          row: row,
          location: "Main Hall",
          area: "Floor 3",
          status: "Available",
        });
      }
    }

    // Insert all seats
    await Seat.insertMany(seats);

    console.log("✅ Seat seeding completed successfully!");
    console.log("\n📊 Seating Layout Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\n🏢 Floor 1 (32 seats):");
    console.log("   Row A: A1, A2, A3, A4, A5, A6, A7, A8");
    console.log("   Row B: B1, B2, B3, B4, B5, B6, B7, B8");
    console.log("   Row C: C1, C2, C3, C4, C5, C6, C7, C8");
    console.log("   Row D: D1, D2, D3, D4, D5, D6, D7, D8");

    console.log("\n🏢 Floor 2 (32 seats):");
    console.log("   Row E: E1, E2, E3, E4, E5, E6, E7, E8");
    console.log("   Row F: F1, F2, F3, F4, F5, F6, F7, F8");
    console.log("   Row G: G1, G2, G3, G4, G5, G6, G7, G8");
    console.log("   Row H: H1, H2, H3, H4, H5, H6, H7, H8");

    console.log("\n🏢 Floor 3 (32 seats):");
    console.log("   Row I: I1, I2, I3, I4, I5, I6, I7, I8");
    console.log("   Row J: J1, J2, J3, J4, J5, J6, J7, J8");
    console.log("   Row K: K1, K2, K3, K4, K5, K6, K7, K8");
    console.log("   Row L: L1, L2, L3, L4, L5, L6, L7, L8");

    console.log("\n📈 Statistics:");
    console.log(`   Total Seats: ${seats.length}`);
    console.log("   Floors: 3");
    console.log("   Rows per Floor: 4");
    console.log("   Seats per Row: 8");
    console.log("   All seats are Available by default");

    console.log("\n🎯 Key Features:");
    console.log("   • Floor-based organization (Floor 1, 2, 3)");
    console.log("   • Consistent alphanumeric naming (A1-L8)");
    console.log("   • Uniform distribution across floors");
    console.log("   • Compatible with admin dashboard filtering");
  } catch (error) {
    console.error("❌ Error seeding seats:", error.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the script
seedSeats();
