const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    college: {
      type: String,
      default: ""
    },

    degree: {
      type: String,
      default: ""
    },

    branch: {
      type: String,
      default: ""
    },

    graduationYear: {
      type: Number,
      default: null
    },

    skills: {
      type: [String],
      default: []
    },

    bio: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
