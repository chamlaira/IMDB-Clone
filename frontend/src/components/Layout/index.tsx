import { ReactNode } from "react";

import Header from "../Header";

import "./styles.scss";
import Footer from "../Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layoutContainer">
      <Header>Header</Header>
      {children}
      <Footer>Footer</Footer>
    </div>
  );
};

export default Layout;
