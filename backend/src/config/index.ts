import dotenv from "dotenv";

dotenv.config(); // Load .env file

export const config = {
  port: process.env.PORT || 5001,
  env: process.env.NODE_ENV || "development",
  apiKey: process.env.API_KEY || "",
};
