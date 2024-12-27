import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const API_URL = process.env.API_URL || "http://www.omdbapi.com/";
const API_KEY = process.env.API_KEY || "";

app.get("/", (_, res) => {
  res.send(`OMDB app listening on port ${PORT}`);
});

// Search for movies
app.get("/search/:searchParam/page/:pageNumber", async (req, res) => {
  const searchParam = req.params.searchParam;
  const pageNumber = req.params.pageNumber;
  // Call the OMDB API with searchParam
  await axios
    .get(`${API_URL}?apiKey=${API_KEY}&s=${searchParam}&page=${pageNumber}`)
    .then((response) => {
      res.send(response.data.Search);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Get movie details
app.get("/movie/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  // Call the OMDB API with movieId
  await axios.get(`${API_URL}?apiKey=${API_KEY}&i=${movieId}`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(PORT, () => {
  console.log(`OMDB app listening on port ${PORT}`);
});
