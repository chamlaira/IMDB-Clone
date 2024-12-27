import { useState } from 'react'
import './App.scss'
import Layout from './components/Layout'
import ThemeContext from './contexts/theme'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  return (
    <ThemeContext.Provider value={theme}>
      <div className="App">
        <Layout setTheme={setTheme}>

        </Layout>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
