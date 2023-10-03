const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/user");

async function signUp(req, res) {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ name, email, password: hashedPassword, isPremiumUser: false });
      console.log("User registered", user.email);
      res.status(200).json({ message: "Signup successful" });
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Sign up failed" });
  }
}

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    "aff135734abed1bf492684a890eb7d59081b5f44b23ded12a7339451b9bc2048"
  );
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    console.log("Entered email:", user.email);
    console.log("Entered Password:", password);
    console.log("Database Password:", user.password);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateAccessToken(user.id, user.name),
      });
      
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "User not authorized" });
  }
}

module.exports = {
  signUp,
  login,
};
