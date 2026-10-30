const path = require("path");
const express = require("express");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const connectDatabase = require("./Database/db");
const userAuthRouter = require("./routes/userAuth.route");
const paymentRouter = require("./routes/paymentIntegrate.route");
const menuRouter = require("./routes/menu.route");
const cartRouter = require("./routes/cart.route");
const searchRouter = require("./routes/serach.route");
const landingRouter = require("./routes/landing.route");
const cors = require("cors");
const helmet = require("helmet");

const server = express();
const PORT = Number(process.env.PORT) || 8080;

server.use(express.urlencoded({ extended: true }));
server.use(
  cors({
    origin: (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
  res.send(`KFC API Server started on port ${PORT}`);
});

server.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database unavailable" });
  }
  return next();
};

server.use(["/Auth", "/api/home", "/api/searchapi", "/api/product", "/api/productcart"], requireDatabase);
server.use("/Auth", userAuthRouter);
server.use("/api/home", landingRouter);
server.use("/api/searchapi", searchRouter);
server.use("/api/product", menuRouter);
server.use("/api/productcart", cartRouter);
server.use("/api/payment", paymentRouter);

const connectWithRetry = async () => {
  try {
    await connectDatabase();
    console.log("Connected to Database");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    setTimeout(connectWithRetry, 5000).unref();
  }
};

server.listen(PORT, () => {
  console.log(`🌎 started on http://localhost:${PORT}/`);
  connectWithRetry();
});
