import { ReactNode, useContext } from "react"

import ThemeContext from "../../contexts/theme"

import "./styles.scss"

interface FooterProps {
  children: ReactNode
}

const Footer = ({ children }: FooterProps) => {
  const theme = useContext(ThemeContext)

  return (
    <div className={`footerContainer ${theme}`}>
      <p>{children}</p>
    </div>
  )
}

export default Footer
