const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const cors = require("cors");

require("dotenv").config(); // Load environment variables from .env file

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// [POST] /api
app.post("/api", async (req, res) => {
  const { services, config } = req.body;

  console.log("req.body", req.body);

  if (!services || !config || !process.env.DAILY_BOTS_KEY) {
    return res.status(400).json("Services or config not found on request body");
  }

  const payload = {
    bot_profile: "voice_2024_10",
    max_duration: 600,
    services,
    api_keys: {
      // Optional API keys here (e.g. OpenAI GPT-4 etc)
    },
    config,
  };

  try {
    const apiResponse = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_BOTS_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await apiResponse.json();

    if (apiResponse.status !== 200) {
      return res.status(apiResponse.status).json(data);
    }

    return res.json(data);
  } catch (error) {
    console.error("Error calling Daily API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
