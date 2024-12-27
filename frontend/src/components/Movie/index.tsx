import { ReactNode, useContext } from "react"

import "./styles.scss"
import ThemeContext from "../../contexts/theme"
import { useParams } from "react-router"
import Layout from "../Layout"


const Movie = () => {
  const theme = useContext(ThemeContext)
  const { id } = useParams()

  return (
    <Layout>
      <div className={`movieContainer-${theme}`}>
        movie {id}
      </div>
    </Layout>
  )
}

export default Movie
