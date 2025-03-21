import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";

import businessData from "./businessData";
import { saveMessage } from "./db";
import db from "./db";

dotenv.config();

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || "development";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("Missing OpenAI API key in environment variables.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the ABC Computer Repair Chat Assistant!",
    env: NODE_ENV,
  });
});

app.post("/chat", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Missing question parameter." });
  }

  try {
    // Save the user message to our db.
    saveMessage("user", question);

    const context = `Business Info: ${JSON.stringify(businessData, null, 2)}`;

    // Initializing weatherInfo as an empty string so we know whether or not to pass it on later.
    let weatherInfo = "";
    if (isWeatherQuestion(question)) {
      weatherInfo = await fetchWeather();
    }

    // Set the necessary headers to stream responses to the user
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant for a computer repair business.",
      },
      { role: "system", content: context },
    ];

    if (weatherInfo) {
      messages.push({
        role: "system",
        content: `Weather Info: ${weatherInfo}`,
      });
    }

    messages.push({ role: "user", content: question });

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      res.write(text); // Stream data to the client
      fullResponse += text;
    }

    // Send our response to the database to sit and wait until we need it.
    saveMessage("assistant", fullResponse);

    res.end(); // End the stream
  } catch (error) {
    console.error(
      "Error processing chat:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate response from OpenAI." });
  }
});

app.get("/messages", (req, res) => {
  try {
    const messages = db
      .prepare("SELECT * FROM messages ORDER BY timestamp ASC")
      .all();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const weatherKeywords = [
  "weather",
  "temperature",
  "forecast",
  "rain",
  "snow",
  "storm",
  "humidity",
  "wind",
  "sunny",
  "cloudy",
  "fog",
  "hail",
  "thunder",
  "lightning",
  "drizzle",
  "heat",
  "cold",
  "climate",
];

// Function to check if a question is about the weather
function isWeatherQuestion(question: string): boolean {
  const lowerQuestion = question.toLowerCase();
  return weatherKeywords.some((keyword) => lowerQuestion.includes(keyword));
}

async function fetchWeather() {
  try {
    const latitude = 40.7128; // Replace with actual location
    const longitude = -74.006; // Replace with actual location
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude,
        longitude,
        current_weather: true,
      },
    });

    const weather = response.data.current_weather;
    return `The current temperature is ${weather.temperature}°C with ${weather.weathercode}.`;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return "Sorry, I couldn't retrieve the weather right now.";
  }
}
