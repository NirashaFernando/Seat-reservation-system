const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/register", async (req, res) => {
  const { name, email, password, role = "intern" } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed, role });

    // Generate token for the new user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Return both token and user data (excluding password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({ token, user: userData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // Return both token and user data (excluding password)
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json({ token, user: userData });
});

module.exports = router;
