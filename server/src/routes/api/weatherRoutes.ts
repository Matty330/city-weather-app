import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Ensure this is installed

const router = express.Router();
const searchHistoryPath = path.resolve('data', 'searchHistory.json'); // Adjust path as needed

// Types for API responses
type GeoData = {
    lat: number;
    lon: number;
    name: string;
    [key: string]: any; // Optional additional properties
};

type WeatherData = {
    list: Array<{
        dt: number;
        main: {
            temp: number;
            humidity: number;
        };
        weather: Array<{
            description: string;
            icon: string;
        }>;
        wind: {
            speed: number;
        };
    }>;
    [key: string]: any; // Optional additional properties
};

// Helper function to read and write JSON files
const readJsonFile = (filePath: string) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
        return [];
    }
};

const writeJsonFile = (filePath: string, data: any) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Type Guard for GeoData
const isGeoData = (data: any): data is GeoData[] => {
    return Array.isArray(data) && data.every(item => item.lat && item.lon && item.name);
};

// Type Guard for WeatherData
const isWeatherData = (data: any): data is WeatherData => {
    return data && Array.isArray(data.list);
};

// POST route to fetch weather data and save the city
router.post('/', async (req, res) => {
    const { city } = req.body;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Fetch geographical coordinates
        const geoResponse = await fetch(
            `${process.env.API_BASE_URL}/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.API_KEY}`
        );
        const geoData = await geoResponse.json(); // Await the response from fetch

        if (!isGeoData(geoData)) {
            return res.status(400).json({ error: 'Invalid geo data' });
        }

        if (geoData.length === 0) {
            return res.status(404).json({ error: 'City not found' });
        }

        const { lat, lon } = geoData[0];

        // Fetch weather data
        const weatherResponse = await fetch(
            `${process.env.API_BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_KEY}`
        );
        const weatherData = await weatherResponse.json(); // Await the response from fetch

        if (!isWeatherData(weatherData)) {
            return res.status(400).json({ error: 'Invalid weather data' });
        }

        // Save to history
        const history = readJsonFile(searchHistoryPath);
        const newEntry = { id: uuidv4(), city, lat, lon, date: new Date().toISOString() };
        history.push(newEntry);
        writeJsonFile(searchHistoryPath, history);

        return res.json({
            current: weatherData.list[0], // Current weather
            forecast: weatherData.list.slice(1, 6), // 5-day forecast
            saved: newEntry,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// GET route for /api/weather/history
router.get('/history', (_, res) => {
    const history = readJsonFile(searchHistoryPath);
    return res.json(history); // Return the cities in the search history
});

// DELETE route to remove a city from history
router.delete('/history/:id', (req, res) => {
    const { id } = req.params;
    const history = readJsonFile(searchHistoryPath);
    const updatedHistory = history.filter((entry: any) => entry.id !== id);
    writeJsonFile(searchHistoryPath, updatedHistory);

    return res.json({ message: 'City deleted', updatedHistory });
});

export default router;
