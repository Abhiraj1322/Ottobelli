// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Path to your User model
require("dotenv").config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if user already exists
    const adminEmail = "admin@ottobelli.com";
    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      console.log("User already exists. Updating role to admin...");
      existingUser.role = "admin";
      await existingUser.save();
      console.log("User updated to admin successfully!");
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("YourAdminPassword123!", salt);

    // Create Admin User
    const adminUser = new User({
      name: "Ottobelli Admin",
      email: adminEmail,
      password:hashedPassword,
      role: "admin", // Explicitly set role
    });

    await adminUser.save();
    console.log("Admin account created successfully!");
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdminUser();