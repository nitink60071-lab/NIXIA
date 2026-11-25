const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const User = require("../models/user");

// Get student profile
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
      profile: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch profile"
    });
  }
});

// Update student profile
router.put("/", protect, async (req, res) => {
  try {
    const { name, college, degree, branch, graduationYear, skills, bio } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    if (name !== undefined) user.name = name;
    if (college !== undefined) user.college = college;
    if (degree !== undefined) user.degree = degree;
    if (branch !== undefined) user.branch = branch;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (skills !== undefined) user.skills = skills;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        name: user.name,
        email: user.email,
        college: user.college,
        degree: user.degree,
        branch: user.branch,
        graduationYear: user.graduationYear,
        skills: user.skills,
        bio: user.bio
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update profile"
    });
  }
});

module.exports = router;
