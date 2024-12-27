import { useSelector } from 'react-redux'

import Layout from './components/Layout'
import { RootState } from './state/store'

import MovieItem from './components/MovieItem'

interface SearchResultsProps {
  setTheme: (theme: 'light' | 'dark') => void
}

const SearchResults = ({ setTheme }: SearchResultsProps) => {
  const searchResults = useSelector((state: RootState) => state.searchResults)

  return (
    <div>
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
              <MovieItem key={result.imdbID} movie={result} />
            ))}
          </div>
        ) : null}
      </Layout>
    </div>
  )
}

export default SearchResults
