import { ReactNode, useContext } from "react";

import "./styles.scss";
import ThemeContext from "../../contexts/theme";

interface FooterProps {
  children: ReactNode;
}

const Footer = ({ children }: FooterProps) => {
  const theme = useContext(ThemeContext);

  return (
    <div className={`footerContainer ${theme}`}>
      <p>{children}</p>
    </div>
  );
};

export default Footer;
