import { ReactNode } from "react";

import "./styles.scss";

interface HeaderProps {
  children: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  return (
    <div className="headerContainer">
      {children}
    </div>
  );
};

export default Header;
