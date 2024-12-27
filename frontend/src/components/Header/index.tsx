import { ReactNode, useContext, useEffect, useState } from "react"
import axios from "axios"

import "./styles.scss"
import useDebounce from "../../hooks/useDebounce"
import ThemeContext from "../../contexts/theme"

interface HeaderProps {
  children: ReactNode
  setTheme?: (theme: "light" | "dark") => void;
}

const Header = ({ children, setTheme }: HeaderProps) => {
  const theme = useContext(ThemeContext)
  const [searchInput, setSearchInput] = useState("")
  const debouncedInput = useDebounce(searchInput, 1000)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const search = async () => {
    if (debouncedInput.length) {
      await axios.get(`http://localhost:8080/search/${debouncedInput}/page/1`)
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.error(error)
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
