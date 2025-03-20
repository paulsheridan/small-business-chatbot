import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

import businessData from "./businessData";

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

// I am exposing all origins and methods in my CORS config. I would never do this in prod, but for the sake of a quick turnaround, I've chosen to do so here.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

// My cheap, simple health-check endpoint
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
    // Format business data as context
    const context = `Business Info: ${JSON.stringify(businessData, null, 2)}`;

    // Generate response using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for a computer repair business.",
        },
        { role: "system", content: context },
        { role: "user", content: question },
      ],
    });

    const answer = response.choices[0].message.content; // Fix here
    res.json({ answer });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Failed to generate response from OpenAI." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
