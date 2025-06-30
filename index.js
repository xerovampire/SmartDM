const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT || 10000;
const GEMINI_API_KEY = "AIzaSyBAASAHLTDCitwQkApFZeYz5HcJhMqZIaY";

app.use(cors());
app.use(express.json());

app.post("/askgpt", async (req, res) => {
  const { message, behavior } = req.body;

  if (!message || !behavior) {
    return res.status(400).json({ reply: "❌ Missing message or behavior." });
  }

  const prompt = `${behavior}\n\n${message}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "⚠️ Gemini gave no meaningful reply.";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ reply: "❌ Gemini API error. Try again." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
