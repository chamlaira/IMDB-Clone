
import "./styles.scss"

interface LoadingProps {
  movie: {
    Title: string
    Year: string
    imdbID: string
    Type: string
    Poster: string
  }
}

const Loading = () => (
  <div>
    <p>Loading...</p>
  </div>
)

export default Loading
