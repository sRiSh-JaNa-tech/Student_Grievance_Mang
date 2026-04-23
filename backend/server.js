require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const grievanceRoutes = require("./routers/grievanceRouter");
const connectDB = require("./config/db");
const authRouter = require("./routers/authRouter");

const app = express();

// CORS setup
app.use(cors({
  origin: 'https://student-grievance-mang.onrender.com',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Connect to DB
connectDB();

// 🔥 Health Check (basic + DB status)
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;

  const states = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };

  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    database: states[dbState],
    timestamp: new Date()
  });
});

// 🔥 Readiness Check (strict DB check)
app.get("/ready", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ status: "Ready" });
  }
  res.status(500).json({ status: "DB not connected" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/grievances", grievanceRoutes);

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
