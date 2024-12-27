import "./styles.scss"

interface DividerProps {
  color?: string
}

const Divider = ({ color }: DividerProps) => (
  <div className="divider" style={{ borderBottomColor: color }}></div>
)

export default Divider
