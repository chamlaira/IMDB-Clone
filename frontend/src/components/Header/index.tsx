import axios from "axios"
import { ReactNode, useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import useDebounce from "../../hooks/useDebounce"
import ThemeContext from "../../contexts/theme"
import { replaceResults, setIsLoading } from "../../state/searchResults/searchResultsSlice"

import "./styles.scss"

interface HeaderProps {
  children: ReactNode
  setTheme?: (theme: "light" | "dark") => void;
}

const Header = ({ children, setTheme }: HeaderProps) => {
  const theme = useContext(ThemeContext)
  const [searchInput, setSearchInput] = useState("")
  const debouncedInput = useDebounce(searchInput, 1000)
  const dispatch = useDispatch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const search = async () => {
    if (debouncedInput.length) {
      dispatch(setIsLoading(true))
      await axios.get(`http://localhost:8080/search/${debouncedInput}/page/1`)
        .then((response) => {
          console.log(response.data)
          dispatch(replaceResults(response.data))
          dispatch(setIsLoading(false))
        })
        .catch((error) => {
          console.error(error)
          dispatch(setIsLoading(false))
        })
    }
  }

  useEffect(() => {
    search()
  }, [debouncedInput])

  return (
    <div className={`headerContainer ${theme}`}>
      <div className="headerContent">
        <p>{children}</p>
      </div>
      <div className="searchContainer">
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={searchInput}
          onChange={handleInputChange}
        />
      </div>
      <button
        className="themeButton"
        onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        Enable {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  )
}

export default Header
