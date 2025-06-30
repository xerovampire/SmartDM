const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyBAASAHLTDCitwQkApFZeYz5HcJhMqZIaY";

app.post("/askgpt", async (req, res) => {
  const { message, behavior } = req.body;

  const prompt = `${behavior}\n\n${message}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      res.status(200).json({ reply });
    } else {
      console.error("⚠️ Gemini API response issue:", JSON.stringify(data, null, 2));
      res.status(200).json({ reply: "❌ No response received." });
    }

  } catch (err) {
    console.error("❌ Gemini API fetch error:", err);
    res.status(500).json({ reply: "❌ Server error." });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});
