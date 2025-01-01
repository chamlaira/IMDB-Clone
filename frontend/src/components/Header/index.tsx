import axios from "axios"
import { ReactNode, useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation, useNavigate } from "react-router"
import { MdDarkMode } from "react-icons/md"
import { MdLightMode } from "react-icons/md"
import { IoSearch } from "react-icons/io5"

import useDebounce from "../../hooks/useDebounce"
import ThemeContext from "../../contexts/theme"
import { replaceResults, setError, setIsLoading } from "../../state/searchResults/searchResultsSlice"
import { replaceInput } from "../../state/searchInput/searchInputSlice"
import { RootState } from "../../state/store"

import "./styles.scss"

interface HeaderProps {
  children: ReactNode
  setTheme?: (theme: "light" | "dark") => void
}

const Header = ({ children, setTheme }: HeaderProps) => {
  const theme = useContext(ThemeContext)
  const searchInputRedux = useSelector((state: RootState) => state.searchInput.searchInput)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // If the user navigates to a different page and goes back to the home page, the search input must not be reset.
  const [searchInput, setSearchInput] = useState(location.pathname === '/' ? searchInputRedux : "")
  const [enteredSearchInput, setEnteredSearchInput] = useState(location.pathname === '/' ? searchInputRedux : "")

  const [inputSource, setInputSource] = useState<'debounce' | 'enter'>('enter')

  const { debouncedValue, setDebouncedValue } = useDebounce(searchInput, 1000)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const search = async (finalSearchInput: string) => {
    dispatch(setIsLoading(true))
    if (finalSearchInput.length) {
      // If search is triggered from a different page, navigate to the home page.
      if (location.pathname !== '/') {
        navigate('/')
      }
      // Fetch search results.
      await axios.get(`${import.meta.env.VITE_API_URL}search/${finalSearchInput}/page/1`)
        .then((response) => {
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
    setEnteredSearchInput("")
    dispatch(replaceInput(""))
    dispatch(replaceResults({
      Response: "False",
      Search: [],
      totalResults: "0"
    }))
    dispatch(setError(""))
    dispatch(setIsLoading(false))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnteredSearchInput(searchInput)
    setInputSource('enter')
  }

  useEffect(() => {
    // Equal results should not trigger a debounced search.
    if (debouncedValue !== enteredSearchInput) {
      setInputSource('debounce')
    }
  }, [debouncedValue, enteredSearchInput])

  useEffect(() => {
    if (enteredSearchInput && inputSource === 'enter') {
      search(enteredSearchInput)
      dispatch(replaceInput(enteredSearchInput))
      // Manually set the debounced value to the entered search input so it does not trigger debounce.
      setDebouncedValue(enteredSearchInput)
    } else if (debouncedValue && inputSource === 'debounce') {
      search(debouncedValue)
      dispatch(replaceInput(debouncedValue))
    }
  }, [debouncedValue, enteredSearchInput, inputSource])

  return (
    <div className={`headerContainer-${theme}`}>
      <div className="headerContent">
        <NavLink onClick={handleHomeClick} to="/"><h1>{children}</h1></NavLink>
      </div>
      <form
        className="searchContainer"
        onSubmit={handleSubmit}
      >
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={searchInput}
          onChange={handleInputChange}
        />
        <button type="submit">
          <IoSearch color="black" />
        </button>
      </form>
      {
        theme === 'dark' ?
          <MdDarkMode
            className="headerToggleThemeButton"
            onClick={() => setTheme && setTheme('light')}
            tabIndex={0}
          /> :
          <MdLightMode
            className="headerToggleThemeButton"
            color="black"
            onClick={() => setTheme && setTheme('dark')}
            tabIndex={0}
          />
      }
    </div>
  )
}

export default Header
