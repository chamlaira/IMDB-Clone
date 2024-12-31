import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import Redis from "ioredis";
import path from "path";

dotenv.config();

const app = express();
const redis = new Redis({
  port: parseInt(process.env.REDIS_PORT || "6379"),
  host: process.env.REDIS_HOST || "localhost",
});

const PORT = process.env.PORT || 8080;
const API_URL = process.env.API_URL || "http://www.omdbapi.com/";
const API_KEY = process.env.API_KEY || "";

app.use(cors());

// Search for movies.
app.get("/search/:searchParam/page/:pageNumber", async (req, res) => {
  const searchParam = req.params.searchParam;
  const pageNumber = req.params.pageNumber;
  const cacheKey = `search-${searchParam}-${pageNumber}`;

  // Check if the search results are in the cache.
  const cacheData = await redis.get(cacheKey);
  if (cacheData) {
    res.json(JSON.parse(cacheData));
    return;
  }

  // Call the OMDB API with searchParam.
  await axios
    .get(`${API_URL}?apiKey=${API_KEY}&s=${searchParam}&page=${pageNumber}`)
    .then(async (response) => {
      res.json(response.data);

      // Cache the search results for 1 hour.
      await redis.set(cacheKey, JSON.stringify(response.data), "EX", 60 * 60);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Get movie details.
app.get("/movie-details/:movieId", async (req: Request, res: Response): Promise<void> => {
  const movieId = req.params.movieId;
  const cacheKey = `movie-${movieId}`;

  // Check if the movie details are in the cache.
  const cacheData = await redis.get(cacheKey);
  if (cacheData) {
    res.json(JSON.parse(cacheData));
    return;
  }
  // Call the OMDB API with movieId.
  await axios.get(`${API_URL}?apiKey=${API_KEY}&i=${movieId}`)
    .then(async (response) => {
      res.json(response.data);

      // Cache the movie details for 1 hour.
      await redis.set(cacheKey, JSON.stringify(response.data), "EX", 60 * 60);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error fetching movie details");
    });
});

// Serve the static files from the React app.
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Handle requests by serving index.html for all routes.
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`OMDB app listening on port ${PORT}`);
});
