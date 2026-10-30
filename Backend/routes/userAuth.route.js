const { Router } = require("express");
const userDetails = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userAuthRouter = Router();

// SIGNUP
userAuthRouter.post("/signup", async (req, res) => {
  try {
    const existingUser = await userDetails.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await userDetails.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: newPassword,
      token: "",
    });
    res.json({ status: "OK" });
  } catch (err) {
    console.error("Signup failed:", err.message);
    res.status(500).json({ status: "ERROR", error: "Unable to create account" });
  }
});

// LOGIN
userAuthRouter.post("/login", async (req, res) => {
  try {
    const user = await userDetails.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ status: "ERROR", error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: "ERROR", error: "Invalid credentials" });
    }

    const secret = process.env.SECRET_KEY || process.env.SECRET_SESSION;
    if (!secret) {
      console.error("Login unavailable: SECRET_KEY is not configured");
      return res.status(500).json({ status: "ERROR", error: "Authentication is not configured" });
    }

    const token = jwt.sign(
      {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      secret
    );
    await userDetails.findOneAndUpdate({ email: req.body.email }, { token });
    return res.json({ status: "OK", user: token });
  } catch (err) {
    console.error("Login failed:", err.message);
    return res.status(500).json({ status: "ERROR", error: "Unable to log in" });
  }
});

// LOGOUT
userAuthRouter.post("/logout", async (req, res) => {
  try {
    const { token } = req.headers;
    const user = await userDetails.findOne({ token: token });
    if (user) {
      user.token = "";
      await user.save();
      return res.status(200).json({ message: "logout successfully" });
    } else {
      return res.status(400).json({ error: "invalid token" });
    }
  } catch (err) {
    console.error("Logout failed:", err.message);
    return res.status(500).json({ error: "Unable to log out" });
  }
});

module.exports = userAuthRouter;
