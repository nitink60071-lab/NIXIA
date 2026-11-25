
const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");

const Resume = require("../models/Resume");
const ai = require("../config/gemini");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// PDF UPLOAD CONFIGURATION
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" &&
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  }
});

// PARSE GEMINI JSON RESPONSE
const parseAIResponse = (text) => {
  const cleanedText = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleanedText);
};

// ==========================================
// AI RESUME ANALYZER
// ==========================================

router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  async (req, res) => {
    let parser;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload your resume PDF."
        });
      }

      // VALIDATE PDF SIGNATURE
      if (req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
        return res.status(400).json({
          success: false,
          message: "Invalid PDF file."
        });
      }

      console.log("Resume analysis started");

      // EXTRACT PDF TEXT
      parser = new PDFParse({
        data: req.file.buffer
      });

      const pdfData = await parser.getText();
      const resumeText = pdfData.text.trim();

      if (!resumeText || resumeText.length < 50) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract enough text. Please upload a text-based PDF."
        });
      }

      if (resumeText.length > 20000) {
        return res.status(400).json({
          success: false,
          message:
            "Resume text is too long. Please upload a shorter resume."
        });
      }

      // ANALYZE RESUME USING GEMINI AI
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",

        contents: `
You are NIXIA AI, a professional student resume reviewer.

Analyze the resume provided below.

Return ONLY a valid JSON object.
Do not use Markdown code fences.
Do not add any text outside the JSON.

Use exactly this structure:

{
  "score": 0,
  "atsCompatibility": "Good",
  "summary": "Short overall resume review",
  "strengths": ["Strength 1", "Strength 2"],
  "technicalSkills": ["Skill 1", "Skill 2"],
  "missingSkills": ["Recommended skill 1"],
  "projectImprovements": ["Improvement 1"],
  "experienceEducationReview": "Review of education and experience",
  "formattingSuggestions": ["Suggestion 1"],
  "recommendations": ["Recommendation 1"]
}

IMPORTANT RULES:

- Score must be an integer between 0 and 100.
- ATS compatibility must be one of: Excellent, Good, Average, Needs Improvement.
- Give an estimated assessment, not a guaranteed ATS score.
- Be honest, practical and constructive.
- Do not invent qualifications, skills, projects or experience.
- Do not assume information that is missing.
- Recommend skills only when relevant to the student's career direction.
- If a section has no relevant information, explain that clearly.
- Use simple, professional English.
- Keep each array concise and useful.
- Never guarantee interviews or jobs.

RESUME CONTENT:

${resumeText}
        `,

        config: {
          maxOutputTokens: 2000,
          responseMimeType: "application/json",
          abortSignal: AbortSignal.timeout(90000)
        }
      });

      if (!response.text) {
        throw new Error("Empty response received from AI.");
      }

      const analysis = parseAIResponse(response.text);

      // VALIDATE AI RESPONSE
      if (
        !Number.isInteger(analysis.score) ||
        analysis.score < 0 ||
        analysis.score > 100
      ) {
        throw new Error("Invalid resume score received from AI.");
      }

      const allowedATS = [
        "Excellent",
        "Good",
        "Average",
        "Needs Improvement"
      ];

      if (!allowedATS.includes(analysis.atsCompatibility)) {
        throw new Error("Invalid ATS compatibility received from AI.");
      }

      // SAVE ANALYSIS IN MONGODB
      const savedResume = await Resume.create({
        user: req.userId,
        score: analysis.score,
        atsCompatibility: analysis.atsCompatibility,
        summary: analysis.summary
      });

      console.log("Resume analysis saved successfully");

      return res.status(200).json({
        success: true,
        message: "Resume analyzed successfully!",
        analysis,
        resumeId: savedResume._id
      });

    } catch (error) {
      console.error("Resume Analysis Error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to analyze resume. Please try again."
      });

    } finally {
      if (parser) {
        await parser.destroy().catch(() => {});
      }
    }
  }
);

// ==========================================
// GET ALL RESUME ANALYSES
// ==========================================

router.get("/history", protect, async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.userId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes
    });

  } catch (error) {
    console.error("Resume History Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch resume history."
    });
  }
});

// ==========================================
// GET LATEST RESUME ANALYSIS
// ==========================================

router.get("/latest", protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      user: req.userId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      resume
    });

  } catch (error) {
    console.error("Latest Resume Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch latest resume."
    });
  }
});

// ==========================================
// HANDLE FILE UPLOAD ERRORS
// ==========================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Resume must be smaller than 5 MB."
          : error.message
    });
  }

  if (error.message === "Only PDF files are allowed.") {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
});

module.exports = router;
