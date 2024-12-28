import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { FaRegPlayCircle } from "react-icons/fa"
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

import ThemeContext from "../../contexts/theme"
import Layout from "../Layout"
import { Movie as IMovie } from "../../interfaces"

import "./styles.scss"
import Divider from "../Divider";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

interface MovieProps {
  setTheme: (theme: "light" | "dark") => void
}

const Movie = ({ setTheme }: MovieProps) => {
  const theme = useContext(ThemeContext)
  const searchInput = useSelector((state: RootState) => state.searchInput.searchInput)
  const { id } = useParams()
  const [movie, setMovie] = useState<IMovie | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchMovie = async () => {
    await axios.get(`${import.meta.env.VITE_API_URL}movie/${id}`)
      .then((response) => {
        console.log(response.data)
        setMovie(response.data)
        setError(null)
      })
      .catch((error) => {
        setError("An error occurred while fetching the movie. Please try again later.")
        console.error(error)
      })
  }

  useEffect(() => {
    fetchMovie()
  }, [])

  return (
    <Layout setTheme={setTheme}>
      {error ? <div>{error}</div> : null}
      {movie ? (
        <div className={`movieContainer-${theme}`}>
          <h1 className="movieTitle">{movie.Title}</h1>
          <div className="movieTagline">
            <p>{movie.Year} • {movie.Rated} • {movie.Runtime}</p>
          </div>
          <div className="movieVideo">
            <img src={movie.Poster} alt={movie.Title} />
            <FaRegPlayCircle className="moviePlayButton" />
          </div>
          <div className="moviePoster">
            <img src={movie.Poster} alt={movie.Title} />
          </div>
          <div className="moviePlotAndGenresContainer">
            <div className="movieGenres">
              {movie.Genre ? movie.Genre.split(', ').map((genre) => (
                <p className="movieGenre" key={genre}>{genre}</p>
                )) : null}
            </div>
            <div className="moviePlot">
              <p>{movie.Plot}</p>
            </div>
          </div>
          <div className="movieRatingContainer">
            <div className="movieRating">
              <FaStar color="yellow" />
              <p>{movie.imdbRating} / 10</p>
            </div>
            <div className="movieRate">
              <CiStar color="#5799ef" />
              <p>Rate</p>
            </div>
          </div>
          <div className="movieDivider">
            <Divider color="gray" />
          </div>
          <div className="moviePeople">
            <h2>Director</h2>
            <p>{movie.Director}</p>
          </div>
          <div className="movieDivider">
            <Divider color="gray" />
          </div>
          <div className="moviePeople">
            <h2>Writers</h2>
            <p>{movie.Writer}</p>
          </div>
          <div className="movieDivider">
            <Divider color="gray" />
          </div>
          <div className="moviePeople">
            <h2>Stars</h2>
            <p>{movie.Actors}</p>
          </div>
          <div className="movieDivider">
            <Divider color="gray" />
          </div>
        </div>
      ) : <div>Loading...</div>}
    </Layout>
  )
}

export default Movie
