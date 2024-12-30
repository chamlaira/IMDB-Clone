import axios from "axios"
import { ReactNode, useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation, useNavigate } from "react-router"
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

import useDebounce from "../../hooks/useDebounce"
import ThemeContext from "../../contexts/theme"
import { replaceResults, setError, setIsLoading } from "../../state/searchResults/searchResultsSlice"
import { replaceInput } from "../../state/searchInput/searchInputSlice";
import { RootState } from "../../state/store";

import "./styles.scss"

interface HeaderProps {
  children: ReactNode
  setTheme?: (theme: "light" | "dark") => void;
}

const Header = ({ children, setTheme }: HeaderProps) => {
  const theme = useContext(ThemeContext)
  const searchInputRedux = useSelector((state: RootState) => state.searchInput.searchInput)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  // If the user navigates to a different page and goes back to the home page, the search input must not be reset.
  const [searchInput, setSearchInput] = useState(location.pathname === '/' ? searchInputRedux : "")
  const debouncedInput = useDebounce(searchInput, 1000)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const search = async () => {
    dispatch(setIsLoading(true))
    if (debouncedInput.length) {
      // If search is triggered from a different page, navigate to the home page.
      if (location.pathname !== '/') {
        navigate('/')
      }
      // Fetch search results.
      await axios.get(`${import.meta.env.VITE_API_URL}search/${debouncedInput}/page/1`)
        .then((response) => {
          console.log(response.data)
          // If the response is successful, replace the search results with the new results.
          if (response.data.Response === "True") {
            dispatch(replaceResults(response.data))
            dispatch(setError(""))
          } else {
            dispatch(setError(response.data.Error))
          }
        })
        .catch((error) => {
          console.error(error)
          dispatch(setError("An error occurred while searching for movies. Please try again later."))
        })
    } else {
      dispatch(replaceResults({
        Response: "False",
        Search: [],
        totalResults: "0"
      }))
      dispatch(setError(""))
    }
    dispatch(setIsLoading(false))
  }

  const handleHomeClick = () => {
    // Reset the search results and input.
    setSearchInput("")
    dispatch(replaceInput(""))
    dispatch(replaceResults({
      Response: "False",
      Search: [],
      totalResults: "0"
    }))
    dispatch(setError(""))
    dispatch(setIsLoading(false))
  }

  useEffect(() => {
    search()
    dispatch(replaceInput(debouncedInput))
  }, [debouncedInput])

  return (
    <div className={`headerContainer header${theme.charAt(0).toUpperCase() + theme.slice(1)}`}>
      <div className="headerContent">
        <NavLink onClick={handleHomeClick} to="/"><h1>{children}</h1></NavLink>
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
