import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router'

import Layout from './components/Layout'
import ThemeContext from './contexts/theme'
import { RootState } from './state/store'

import './App.scss'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const searchResults = useSelector((state: RootState) => state.searchResults)

  return (
    <ThemeContext.Provider value={theme}>
      <div className="App">
        <Layout setTheme={setTheme}>
          {
            searchResults.error?.length ? <div>{searchResults.error}</div> : null
          }
          {
            searchResults.loading ? <div>Loading...</div> : null
          }
          {!searchResults.error && !searchResults.loading && searchResults.searchResults.Search ? (
            <div>
              {searchResults.searchResults.Search.map((result) => (
                <NavLink to={`/movie/${result.imdbID}`} key={result.imdbID} end>{result.Title}</NavLink>
              ))}
            </div>
          ) : null}
        </Layout>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
