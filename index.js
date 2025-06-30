const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/askgpt", async (req, res) => {
  const { message, behavior } = req.body;

  const GEMINI_API_KEY = "AIzaSyBAASAHLTDCitwQkApFZeYz5HcJhMqZIaY";
  const prompt = `${behavior}\n\n${message}`;

  try {
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
    });

    const data = await apiResponse.json();

    console.log("🧠 Gemini API Response:", JSON.stringify(data, null, 2)); // log the full response

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      res.json({ reply });
    } else {
      res.json({ reply: "⚠️ Gemini gave no meaningful reply." });
    }
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    res.status(500).json({ reply: "❌ Gemini API error. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
