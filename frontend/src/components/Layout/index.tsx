import { ReactNode } from "react";

import Header from "../Header";
import Footer from "../Footer";

import "./styles.scss";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layoutContainer">
      <Header>OMDB</Header>
      {children}
      <Footer>© Laira Nicole Cham</Footer>
    </div>
  );
};

export default Layout;
