import axios from "axios"
import { ReactNode, useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { NavLink, useLocation, useNavigate } from "react-router"
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

import useDebounce from "../../hooks/useDebounce"
import ThemeContext from "../../contexts/theme"
import { replaceResults, setError, setIsLoading } from "../../state/searchResults/searchResultsSlice"

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
  const navigate = useNavigate()
  const location = useLocation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const search = async () => {
    if (debouncedInput.length) {
      if (location.pathname !== '/') {
        navigate('/')
      }
      dispatch(setIsLoading(true))
      await axios.get(`http://localhost:8080/search/${debouncedInput}/page/1`)
        .then((response) => {
          console.log(response.data)
          if (response.data.Response === "True") {
            dispatch(replaceResults(response.data))
            dispatch(setError(""))
          } else {
            dispatch(setError(response.data.Error))
          }
          dispatch(setIsLoading(false))
        })
        .catch((error) => {
          console.error(error)
          dispatch(setError("An error occurred while searching for movies. Please try again later."))
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
        <NavLink to="/"><h1>{children}</h1></NavLink>
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
      {
        theme === 'dark' ?
          <MdDarkMode
            className="headerToggleThemeButton"
            onClick={() => setTheme && setTheme('light')}
          /> :
          <MdLightMode
            className="headerToggleThemeButton"
            color="black"
            onClick={() => setTheme && setTheme('dark')}
          />
      }
    </div>
  )
}

export default Header
