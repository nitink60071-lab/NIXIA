
const express = require("express");
const router = express.Router();

const ai = require("../config/gemini");
const protect = require("../middleware/authMiddleware");

// ========================================
// 1. TEST GEMINI AI CONNECTION
// ========================================

router.post("/test", protect, async (req, res) => {
  try {
    console.log("Gemini test request started");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents:
        "Introduce yourself as the AI career assistant of NIXIA in two sentences.",
      config: {
        maxOutputTokens: 100,
        abortSignal: AbortSignal.timeout(90000)
      }
    });

    console.log("Gemini test response received");

    return res.status(200).json({
      success: true,
      message: "Gemini AI connected successfully!",
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini Test Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Gemini AI request failed"
    });
  }
});


// ========================================
// 2. AI CAREER ASSISTANT CHAT
// ========================================

router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid message."
      });
    }

    // Limit message length
    if (message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Message must not exceed 5000 characters."
      });
    }

    console.log("NIXIA AI Chat request started");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
You are NIXIA AI, a professional AI Career Assistant.

Your main responsibilities:

1. Career Guidance:
   Help students choose suitable career paths.

2. Resume Assistance:
   Suggest improvements to resumes and projects.

3. Skill Development:
   Recommend technical and soft skills.

4. Interview Preparation:
   Help students prepare for technical and HR interviews.

5. Programming Help:
   Explain programming concepts with examples.

6. Placement Preparation:
   Guide students about placements, internships and job preparation.

7. Learning Roadmaps:
   Create practical step-by-step learning plans.

Instructions:

- Be friendly, professional and helpful.
- Use simple English.
- You may respond in Hindi or Hinglish if the student asks.
- Give structured and practical answers.
- Use headings and bullet points when useful.
- Avoid unnecessary long answers.
- Never invent job openings, salaries or placement statistics.

Student's question:

${message.trim()}
      `,
      config: {
        maxOutputTokens: 1000,
        abortSignal: AbortSignal.timeout(90000)
      }
    });

    console.log("NIXIA AI Chat response received");

    return res.status(200).json({
      success: true,
      reply: response.text
    });

  } catch (error) {
    console.error("NIXIA AI Chat Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "AI assistant could not generate a response."
    });
  }
});


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;
