const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Schema/user.model");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

//Register user
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Create and save the new user
    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    //find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //generate accessToken
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //generate refreshToken
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "3d",
      }
    );

    res
      .status(200)
      .json({ message: "Signin successfull", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Refresh Token
router.post("/token", async (req, res) => {
  //get refresh token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Refresh token required" });
  }
  const refreshToken = authHeader.split(" ")[1];
  //if refresh token not provided
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });
  try {
    //Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    //Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

module.exports = router;
