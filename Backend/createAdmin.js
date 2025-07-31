const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/user");

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

const createAdmin = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@admin.com" });

    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      console.log("Email: admin@admin.com");
      console.log("You can use this existing admin account to login.");
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);

    // Create admin user
    const admin = new User({
      name: "Admin Nirasha",
      email: "admin@admin.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@admin.com");
    console.log("🔑 Password: admin123");
    console.log("👤 Role: admin");
    console.log(
      "\n🚀 You can now login to the admin dashboard with these credentials."
    );
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the script
createAdmin();
