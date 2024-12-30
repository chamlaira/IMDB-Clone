import { useContext } from "react"
import { NavLink } from "react-router"

import ThemeContext from "../../contexts/theme"

import "./styles.scss"

interface MovieItemProps {
  movie: {
    Title: string
    Year: string
    imdbID: string
    Type: string
    Poster: string
  }
}

const MovieItem = ({ movie }: MovieItemProps) => {
  const theme = useContext(ThemeContext)

  return (
    <NavLink className="movieItemContainer" to={`/movie/${movie.imdbID}`} end>
      <div className="movieItemPoster">
        <img src={movie.Poster} alt={movie.Title} />
      </div>
      <div className="movieItemDetails">
        <h3 className="movieItemTitle">
          {movie.Title}
        </h3>
        <p className="movieItemYear">
          {movie.Year}
        </p>
      </div>
    </NavLink>
  )
}

export default MovieItem
