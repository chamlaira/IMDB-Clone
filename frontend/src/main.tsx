import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router'

import App from './App'
import Movie from './components/Movie'
import { store } from './state/store'

import './index.scss'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route index element={<React.StrictMode><App /></React.StrictMode>} />
        <Route path="/movie/:id" element={<React.StrictMode><Movie /></React.StrictMode>} />
      </Routes>
    </BrowserRouter>
  </Provider>
)
