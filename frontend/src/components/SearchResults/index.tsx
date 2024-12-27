import { ReactNode, useContext } from "react"

import "./styles.scss"
import ThemeContext from "../../contexts/theme"

interface SearchResultsProps {
  children: ReactNode
}

const SearchResults = ({ children }: SearchResultsProps) => {
  const theme = useContext(ThemeContext)

  return (
    <div className={`searchResultsContainer-${theme}`}>
      {children}
    </div>
  )
}

export default SearchResults
