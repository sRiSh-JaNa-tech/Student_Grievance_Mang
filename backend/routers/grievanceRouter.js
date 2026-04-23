const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
  searchGrievances
} = require("../controllers/grievanceController");

// All grievance routes are protected
router.use(protect);

router.post("/", createGrievance);
router.get("/", getGrievances);
router.get("/search", searchGrievances); // Important: put /search before /:id otherwise 'search' is treated as an id
router.get("/:id", getGrievanceById);
router.put("/:id", updateGrievance);
router.delete("/:id", deleteGrievance);

module.exports = router;
