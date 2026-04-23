require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const grievanceRoutes = require("./routers/grievanceRouter");
const connectDB = require("./config/db");
const authRouter = require("./routers/authRouter");

const app = express();

// CORS setup — whitelist all known frontend origins
const allowedOrigins = [
  'https://student-grievance-mang.onrender.com',   // Render frontend
  'https://student-grievance-service.onrender.com', // alt frontend URL
  'http://localhost:5173',                           // Vite dev server
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
