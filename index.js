const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.post("/askgpt", async (req, res) => {
  try {
    const { message, behavior } = req.body;
    const prompt = `${behavior}\n\n${message}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBAASAHLTDCitwQkApFZeYz5HcJhMqZIaY`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Gemini API responded with no content.";
    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ reply: "❌ Gemini API error." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
