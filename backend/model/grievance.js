const mongoose = require("mongoose");

const GrievanceSchema = new mongoose.Schema({
  title: String,
  description: String,

  category: {
    type: String,
    enum: ["Academic", "Hostel", "Transport", "Other"],
    required: true
  },

  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Resolved"]
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Grievance", GrievanceSchema);