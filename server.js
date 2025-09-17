const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyAJXEESW_SZQAKKYyxpLDOhjR6bh0NhZ7o";

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB3ixPasXS_kry52GjyPh0NZ8iJfzusBE8`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );
    const aiResponse = response.data.contents[0].parts[0].text;
    res.json({ reply: aiResponse });
  } catch (err) {
    res.status(500).json({ reply: "Error: Unable to get AI response." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));