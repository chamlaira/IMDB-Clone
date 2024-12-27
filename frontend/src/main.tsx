import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router'

import App from './SearchResults'
import Movie from './components/Movie'
import ThemeContext from './contexts/theme'
import { store } from './state/store'

import './index.scss'

function Root() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={theme}>
        <BrowserRouter>
          <Routes>
            <Route index element={<React.StrictMode><App setTheme={setTheme} /></React.StrictMode>} />
            <Route path="/movie/:id" element={<React.StrictMode><Movie setTheme={setTheme} /></React.StrictMode>} />
          </Routes>
          </BrowserRouter>
      </ThemeContext.Provider>
    </Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />)
