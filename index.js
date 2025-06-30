const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/askgpt", async (req, res) => {
  const { message, behavior } = req.body;

  const GEMINI_API_KEY = "AIzaSyBAASAHLTDCitwQkApFZeYz5HcJhMqZIaY";
  const prompt = `${behavior}\n\n${message}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No response received.";
    res.json({ reply });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ reply: "❌ Server error while connecting to Gemini API." });
  }
});

// ✅ FIX: Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
