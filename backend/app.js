const express = require("express");
const cors = require("cors");
// const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// dotenv.config(); // Load API key from .env

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyDo3Y0qZ5HPmGGoTNGl_6xmxbOAE8q3cSY");

app.post("/sendMessage", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format message to guide Gemini for ideal mental health tone and response style
    const formattedMessage = `
You are a friendly and supportive mental health chatbot.
Your job is to give the best possible response while keeping it brief, warm, and emotionally supportive.
Reply clearly and kindly, as if you're talking to a real person who needs comfort.

User: ${message}
Chatbot:
    `.trim();

    const result = await model.generateContent(formattedMessage);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: text?.trim() || "You're not alone. I'm here for you anytime.",
    });
  } catch (error) {
    console.error("API error:", error.message || error);
    res.status(500).json({
      error: "Failed to fetch response from Google AI.",
      details: error.message || error,
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
