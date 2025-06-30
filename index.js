const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

app.post("/askgpt", async (req, res) => {
  const { message, behavior } = req.body;
  const prompt = `${behavior}\n\n${message}`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta1/models/gemini-pro:generateContent?key=AIzaSyBAASAHLTDCitwQkApFZeYz5HcJhMqZIaY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Gemini gave no reply.";
    res.json({ reply });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ reply: "❌ Gemini API error. Try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
