import { useState } from 'react'
import { useSelector } from 'react-redux'

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
          {!searchResults.error && !searchResults.loading ? (
            <div>
              {searchResults.searchResults.Search.map((result) => (
                <div key={result.imdbID}>{result.Title}</div>
              ))}
            </div>
          ) : null}
          {
            searchResults.loading ? <div>Loading...</div> : null
          }
          {
            searchResults.error ? <div>Error searching for movies. Please try again later.</div> : null
          }
        </Layout>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
