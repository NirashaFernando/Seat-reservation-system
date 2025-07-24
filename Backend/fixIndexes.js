require("dotenv").config();
const mongoose = require("mongoose");
const Reservation = require("./models/reservations");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const fixIndexes = async () => {
  try {
    await connectDB();

    console.log("Current indexes:");
    const indexes = await Reservation.collection.getIndexes();
    console.log(indexes);

    console.log("\nDropping old indexes...");

    try {
      // Try to drop the problematic index
      await Reservation.collection.dropIndex("intern_1_date_1");
      console.log("Dropped intern_1_date_1 index");
    } catch (error) {
      console.log("intern_1_date_1 index doesn't exist or already dropped");
    }

    try {
      // Drop any other old indexes that might conflict
      await Reservation.collection.dropIndex({ intern: 1, date: 1 });
      console.log("Dropped intern date index");
    } catch (error) {
      console.log("intern date index doesn't exist or already dropped");
    }

    console.log("\nRecreating proper indexes...");

    // Ensure the correct indexes exist
    await Reservation.collection.createIndex({ userId: 1, date: 1 });
    console.log("Created userId_1_date_1 index");

    await Reservation.collection.createIndex({
      seatId: 1,
      date: 1,
      timeSlot: 1,
    });
    console.log("Created seatId_1_date_1_timeSlot_1 index");

    console.log("\nCleaning up cancelled reservations with null values...");

    // Clean up any reservations that might have null userId values
    const result = await Reservation.deleteMany({
      $or: [{ userId: null }, { userId: { $exists: false } }],
    });

    console.log(
      `Deleted ${result.deletedCount} reservations with null/missing userId`
    );

    console.log("\nFinal indexes:");
    const finalIndexes = await Reservation.collection.getIndexes();
    console.log(finalIndexes);

    console.log("\nIndex fix completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing indexes:", error);
    process.exit(1);
  }
};

fixIndexes();
