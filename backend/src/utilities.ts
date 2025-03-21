import axios from "axios";
import businessData from "./businessData";
import { saveMessage } from "./db";

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
export function isWeatherQuestion(question: string): boolean {
  const lowerQuestion = question.toLowerCase();
  return weatherKeywords.some((keyword) => lowerQuestion.includes(keyword));
}

export async function fetchWeather() {
  try {
    // These are set to downtown Seattle.
    const latitude = 47.6061;
    const longitude = 122.3328;
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
