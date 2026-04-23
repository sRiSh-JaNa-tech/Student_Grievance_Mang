require("dotenv").config();
const express = require("express");
const cors = require("cors");
const grievanceRoutes = require("./routers/grievanceRouter");
const connectDB = require("./config/db");
const authRouter = require("./routers/authRouter");

const app = express();

app.use(cors({
  origin: true, // adjust origin if needed
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/grievances", grievanceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});