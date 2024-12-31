import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { NavLink, useParams } from "react-router"
import { FaRegPlayCircle } from "react-icons/fa"
import { FaStar } from "react-icons/fa"
import { CiStar } from "react-icons/ci"
import { useDispatch, useSelector } from "react-redux"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { createClient } from "@supabase/supabase-js"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { IoSparklesOutline } from "react-icons/io5";

import ThemeContext from "../../contexts/theme"
import Layout from "../Layout"
import Divider from "../Divider"
import Loading from "../Loading"
import { Movie as IMovie } from "../../interfaces"
import { RootState } from "../../state/store"
import { addMovie } from "../../state/viewedMovies/viewedMoviesSlice"

import "./styles.scss"

interface MovieProps {
  setTheme: (theme: "light" | "dark") => void
}

interface Doc {
  pageContent: string
}

const Movie = ({ setTheme }: MovieProps) => {
  const theme = useContext(ThemeContext)
  const viewedMovies = useSelector((state: RootState) => state.viewedMovies.viewedMovies)
  const dispatch = useDispatch()
  const { id } = useParams()
  const [movie, setMovie] = useState<IMovie | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<string | null>(null)
  const [firstRecommendation, setFirstRecommendation] = useState<IMovie | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch the movie details.
  const fetchMovie = async () => {
    await axios.get(`${import.meta.env.VITE_API_URL}movie-details/${id}`)
      .then((response) => {
        console.log(response.data)
        setMovie(response.data)
        dispatch(addMovie(response.data))
        setError(null)
      })
      .catch((error) => {
        setError("An error occurred while fetching the movie. Please try again later.")
        console.error(error)
      })
  }

  // This function will be called when the user clicks the "Get recommendations" button.
  const handleRecommendations = async () => {
    setIsLoading(true)

    // Split the JSON into chunks.
    const splitter = new RecursiveCharacterTextSplitter()
    const chunks = await splitter.createDocuments([JSON.stringify(viewedMovies)])

    // Delete the entries from the vector db.
    const SUPABSE_URL = import.meta.env.VITE_SUPABASE_URL
    const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
    const client = createClient(SUPABSE_URL, SUPABASE_API_KEY)
    await client.from("documents").delete().neq("id", 0)

    // Send the chunks to the vector db.
    await SupabaseVectorStore.fromDocuments(
      chunks,
      new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
      {
        client,
        tableName: "documents"
      }
    )

    const question = "What movies are similar in all the movies in the vector db?"
    const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY })
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY })
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents"
    })
    const retriever = vectorStore.asRetriever()
    const combineDocuments = (docs: Doc[]) => {
      return docs.map((doc) => doc.pageContent).join(" ")
    }
    const answerTemplate = `Suggest movies that are similar to the following JSON-formatted movies. Don't include the movies listed here. Output the movies separated by commas.
    Movies: {movies}
    answer: `
    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

    // Convert standalone question to embeddings and output to string.
    const retrieverChain = RunnableSequence.from([
      retriever,
      combineDocuments,
    ])

    const chain = RunnableSequence.from([
      {
        movies: retrieverChain
      },
      // Pass the movies to the answer prompt.
      answerPrompt,
      // Pass the prompt to the LLM.
      llm,
      // Parse the output.
      new StringOutputParser()
    ])

    const response = await chain.invoke(question)
    setRecommendations(response)
    setIsLoading(false)
    console.log('results', response)
  }

  const getFirstMovie = async (movie: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}search/${movie}/page/1`)
      if (response.data.Response === 'True') {
        const firstMovie = await response.data.Search[0]
        setFirstRecommendation(firstMovie)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // Fetch the movie details.
    fetchMovie()

    // Reset recommendations.
    setRecommendations(null)
    setFirstRecommendation(null)
  }, [id])

  // Get the first movie from the recommendations.
  useEffect(() => {
    const firstMovie = recommendations?.split(",")[0]
    if (firstMovie) {
      getFirstMovie(firstMovie)
    }
  }, [recommendations])

  return (
    <Layout setTheme={setTheme}>
      {error ? <div><p>{error}</p></div> : (
        isLoading ? <Loading /> : null
      )}
      {movie ? (
        <div>
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
            <div className="movieRecommendationsButton">
              {
                isLoading ? <Loading center /> : (
                  <button
                    onClick={handleRecommendations}
                  >
                    <IoSparklesOutline />
                    Get recommendations
                  </button>
                )
              }
            </div>
            {
              recommendations ? (
                <div className="movieRecommendations">
                  <h2>Recommendations based on movies you've viewed</h2>
                  <p>{recommendations}</p>
                </div>
              ) : null
            }
          </div>
          {
          firstRecommendation ? (
              <NavLink
                className="movieFirstRecommendation"
                to={`/movie/${firstRecommendation.imdbID}`}
                end
              >
                <img src={firstRecommendation.Poster} alt={firstRecommendation.Title} />
                <p>{firstRecommendation.Title}</p>
              </NavLink>
          ) : null
          }
        </div>
      ) : null}
    </Layout>
  )
}

export default Movie
