
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const User = require("../models/user");

// Get logged-in student's dashboard
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      student: {
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard data"
    });
  }
});

module.exports = router;
