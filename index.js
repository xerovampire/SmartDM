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
    const apiKey = "AIzaSyBAASAHLTDCitwQkApFZeYz5HcJhMqZIaY";

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
  {
    text: `${behavior || "You are a helpful assistant."}\n\n${message || "Hello!"}`
  }
]
        }
      ]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Gemini gave no meaningful reply.";
    res.json({ reply });

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ reply: "❌ Server error with Gemini API." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server live on port ${PORT}`);
});
