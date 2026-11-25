
const express = require("express");
const mongoose = require("mongoose");

const Interview = require("../models/Interview");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Save a new interview
router.post("/save", protect, async (req, res) => {
  try {
    const { role, level, questions, totalScore, status } = req.body;

    if (!role || !level || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Role, level and questions are required."
      });
    }

    const interview = await Interview.create({
      user: req.userId,
      role,
      level,
      questions,
      totalScore: totalScore || 0,
      status: status || "In Progress"
    });

    res.status(201).json({
      success: true,
      message: "Interview saved successfully!",
      interview
    });

  } catch (error) {
    console.error("Save Interview Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to save interview."
    });
  }
});

// Get logged-in user's interview history
router.get("/history", protect, async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.userId
    })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews
    });

  } catch (error) {
    console.error("Interview History Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch interview history."
    });
  }
});

// Get interview performance statistics
router.get("/stats", protect, async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.userId
    }).sort({ createdAt: 1 });

    const completedInterviews = interviews.filter(
      (item) => item.status === "Completed"
    );

    const getAverageScore = (interview) => {
      const scoredQuestions = interview.questions.filter(
        (question) => question.answer && question.feedback
      );

      if (scoredQuestions.length === 0) return 0;

      const total = scoredQuestions.reduce(
        (sum, question) => sum + question.score,
        0
      );

      return Number((total / scoredQuestions.length).toFixed(1));
    };

    const scores = completedInterviews.map(getAverageScore);

    const averageScore = scores.length
      ? Number(
          (
            scores.reduce((sum, score) => sum + score, 0) /
            scores.length
          ).toFixed(1)
        )
      : 0;

    const bestScore = scores.length
      ? Math.max(...scores)
      : 0;

    const roleMap = {};

    completedInterviews.forEach((interview) => {
      if (!roleMap[interview.role]) {
        roleMap[interview.role] = {
          role: interview.role,
          totalScore: 0,
          attempts: 0
        };
      }

      roleMap[interview.role].totalScore += getAverageScore(interview);
      roleMap[interview.role].attempts += 1;
    });

    const rolePerformance = Object.values(roleMap).map((item) => ({
      role: item.role,
      attempts: item.attempts,
      averageScore: Number(
        (item.totalScore / item.attempts).toFixed(1)
      )
    }));

    const recentPerformance = completedInterviews.map((item) => ({
      date: item.createdAt,
      role: item.role,
      score: getAverageScore(item)
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalInterviews: interviews.length,
        completedInterviews: completedInterviews.length,
        averageScore,
        bestScore
      },
      rolePerformance,
      recentPerformance
    });

  } catch (error) {
    console.error("Interview Stats Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch performance statistics."
    });
  }
});

// Update an existing interview
router.put("/:id/update", protect, async (req, res) => {
  try {
    const { questions, totalScore, status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID."
      });
    }

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Questions must be an array."
      });
    }

    if (
      totalScore !== undefined &&
      (!Number.isFinite(totalScore) || totalScore < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid total score."
      });
    }

    if (
      status !== undefined &&
      !["In Progress", "Completed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview status."
      });
    }

    const interview = await Interview.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId
      },
      {
        $set: {
          questions,
          ...(totalScore !== undefined && { totalScore }),
          ...(status !== undefined && { status })
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview updated successfully!",
      interview
    });

  } catch (error) {
    console.error("Update Interview Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update interview."
    });
  }
});

// Get one interview by ID
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID."
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.userId
    }).select("-__v");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found."
      });
    }

    res.status(200).json({
      success: true,
      interview
    });

  } catch (error) {
    console.error("Get Interview Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch interview."
    });
  }
});

module.exports = router;
