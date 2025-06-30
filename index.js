const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = "AIzaSyBAASAHLTDCitwQkApFZeYz5HcJhMqZIaY";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Gemini SmartDM backend is running.");
});

app.post("/askgpt", async (req, res) => {
  const { message, behavior } = req.body;

  if (!message || !behavior) {
    return res.status(400).json({ reply: "❌ Message or behavior missing." });
  }

  const prompt = `${behavior}\n\n${message}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("🧠 Gemini raw response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Gemini replied but no content received.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
    res.status(500).json({ reply: "❌ Gemini API error." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SmartDM backend running on port ${PORT}`);
});
