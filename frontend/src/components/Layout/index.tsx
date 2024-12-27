import { ReactNode, useContext } from "react"

import Header from "../Header"
import Footer from "../Footer"

import "./styles.scss"
import ThemeContext from "../../contexts/theme"

interface LayoutProps {
  children?: ReactNode
  setTheme?: (theme: "light" | "dark") => void
}

const Layout = ({ children, setTheme }: LayoutProps) => {
  const theme = useContext(ThemeContext)

  return (
    <div className={`layoutContainer-${theme}`}>
      <Header setTheme={setTheme}>OMDB</Header>
      {children}
      <Footer>© Laira Nicole Cham</Footer>
    </div>
  )
}

export default Layout
