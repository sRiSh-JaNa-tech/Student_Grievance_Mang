const Grievance = require("../model/grievance");

// Submit grievance
const createGrievance = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const grievance = new Grievance({
      title,
      description,
      category,
      studentId: req.user._id
    });
    const saved = await grievance.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error submitting grievance", error: error.message });
  }
};

// View all grievances for logged in user
const getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ studentId: req.user._id }).sort("-createdAt");
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching grievances", error: error.message });
  }
};

// View grievance by ID
const getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ _id: req.params.id, studentId: req.user._id });
    if (!grievance) return res.status(404).json({ message: "Grievance not found" });
    res.status(200).json(grievance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching grievance", error: error.message });
  }
};

// Update grievance
const updateGrievance = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;
    const grievance = await Grievance.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user._id },
      { title, description, category, status },
      { new: true, runValidators: true }
    );
    if (!grievance) return res.status(404).json({ message: "Grievance not found" });
    res.status(200).json(grievance);
  } catch (error) {
    res.status(400).json({ message: "Error updating grievance", error: error.message });
  }
};

// Delete grievance
const deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
    if (!grievance) return res.status(404).json({ message: "Grievance not found" });
    res.status(200).json({ message: "Grievance deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting grievance", error: error.message });
  }
};

// Search grievance
const searchGrievances = async (req, res) => {
  try {
    const { title } = req.query;
    const query = { studentId: req.user._id };
    if (title) {
        query.title = { $regex: title, $options: "i" };
    }
    const grievances = await Grievance.find(query).sort("-createdAt");
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Error searching grievances", error: error.message });
  }
};

module.exports = {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
  searchGrievances
};
