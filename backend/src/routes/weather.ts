import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Fallback for demo if API key is missing
    if (!apiKey || apiKey === "dummy_key") {
      console.log("Mocking Weather response (No API key found)");
      return res.json({
        city: "Pune",
        forecast: [
          { temp: 32, main: "Clear", icon: "01d", date: "Today" },
          { temp: 24, main: "Rain", icon: "10d", date: "Tomorrow" },
          { temp: 28, main: "Clouds", icon: "03d", date: "Day After" },
        ]
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat || 18.5204}&lon=${lon || 73.8567}&appid=${apiKey}&units=metric`
    );
    
    // OpenWeather 5-day forecast returns data every 3 hours.
    // We pick 3 distinct days (Today, Tomorrow, Day After) at approximately the same time.
    const list = response.data.list;
    const daily: any[] = [];
    const seenDays = new Set();
    const today = new Date().toLocaleDateString();

    for (const item of list) {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!seenDays.has(date) && daily.length < 3) {
        seenDays.add(date);
        daily.push({
          temp: Math.round(item.main.temp),
          main: item.weather[0].main,
          icon: item.weather[0].icon,
          date: date === today ? "Today" : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        });
      }
    }

    res.json({
      city: response.data.city.name,
      forecast: daily
    });
  } catch (error: any) {
    console.error("Weather API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

export const weatherRouter = router;
