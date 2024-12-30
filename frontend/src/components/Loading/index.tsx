import { useContext } from "react"
import { GoDotFill } from "react-icons/go"

import ThemeContext from "../../contexts/theme"

import "./styles.scss"

interface LoadingProps {
  center?: boolean
}

const Loading = ({ center }: LoadingProps) => {
  const theme = useContext(ThemeContext)

  return (
    <div className={`loadingContainer ${center ? 'loadingCenter' : ''}`}>
      <GoDotFill color={theme === 'light' ? 'black' : undefined} />
      <GoDotFill color={theme === 'light' ? 'black' : undefined} />
      <GoDotFill color={theme === 'light' ? 'black' : undefined} />
    </div>
  )
}

export default Loading
