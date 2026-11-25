
const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      required: true
    },

    level: {
      type: String,
      required: true
    },

    questions: [
      {
        question: {
          type: String,
          required: true
        },

        answer: {
          type: String,
          default: ""
        },

        feedback: {
          type: String,
          default: ""
        },

        score: {
          type: Number,
          min: 0,
          max: 10,
          default: 0
        }
      }
    ],

    totalScore: {
      type: Number,
      min: 0,
      default: 0
    },

    status: {
      type: String,
      enum: ["In Progress", "Completed"],
      default: "In Progress"
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Interview ||
  mongoose.model("Interview", interviewSchema);
