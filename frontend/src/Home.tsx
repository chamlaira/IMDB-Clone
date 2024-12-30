import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Layout from './components/Layout'
import Loading from './components/Loading'
import MovieItem from './components/MovieItem'
import { RootState } from './state/store'
import { addResults } from './state/searchResults/searchResultsSlice'

interface HomeProps {
  setTheme: (theme: 'light' | 'dark') => void
}

const Home = ({ setTheme }: HomeProps) => {
  const searchResults = useSelector((state: RootState) => state.searchResults)
  const searchInput = useSelector((state: RootState) => state.searchInput)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observerRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()

  const fetchMoreData = useCallback(async () => {
    if (!hasMore || !searchInput.searchInput.length) return

    await axios.get(`${import.meta.env.VITE_API_URL}search/${searchInput.searchInput}/page/${page + 1}`)
      .then((response) => {
        if (response.data.Response === 'True') {
          dispatch(addResults(response.data.Search))
          setPage(page + 1)
          if (response.data.Search.length === 0) {
            setHasMore(false)
          }
        } else {
          setHasMore(false)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [hasMore, searchInput, page, searchResults])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreData()
      }
      // Threshold 1 means the element is 100% visible.
    }, { threshold: 1 })

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [observerRef, hasMore, page, searchResults, searchInput])

  return (
    <div>
      <Layout setTheme={setTheme}>
        {
          searchResults.error?.length ? <div>{searchResults.error}</div> : null
        }
        {
          searchResults.loading ? <Loading /> : null
        }
        {!searchResults.error && !searchResults.loading && searchResults.searchResults.Search ? (
          <>
            <div>
              {searchResults.searchResults.Search.map((result) => (
                <MovieItem key={result.imdbID} movie={result} />
              ))}
            </div>
            <div
              ref={observerRef}
            >
              {hasMore && searchInput.searchInput.length ? <Loading /> : <p>No items to display</p>}
            </div>
          </>
        ) : null}
      </Layout>
    </div>
  )
}

export default Home
