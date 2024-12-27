import { ReactNode } from "react";

import "./styles.scss";

interface HeaderProps {
  children: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  return (
    <div className="headerContainer">
      <div className="headerContent">
        {children}
      </div>
      <div className="searchContainer">
        <input className="search" type="text" placeholder="Search movies..." />
      </div>
    </div>
  );
};

export default Header;
