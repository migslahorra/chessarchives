const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });

    const result = await user.save();

    res.status(201).json({
      message: "User created successfully",
      result
    });
  } catch (error) {
    console.error("Signup failed:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Auth failed: User not found" });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Auth failed: Wrong password" });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      "A_very_long_string_for_our_secret", // Replace with environment variable in production
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Authentication successful",
      token,
      expiresIn: 3600,
      userId: user._id
    });
  } catch (error) {
    console.error("Signin failed:", error);
    res.status(500).json({ error: "Signin failed" });
  }
});

module.exports = router;
