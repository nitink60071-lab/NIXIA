
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    atsCompatibility: {
      type: String,
      enum: [
        "Excellent",
        "Good",
        "Average",
        "Needs Improvement"
      ],
      required: true
    },

    summary: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.Resume ||
  mongoose.model("Resume", resumeSchema);
