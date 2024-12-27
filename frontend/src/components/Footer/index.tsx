import { ReactNode } from "react";

import "./styles.scss";

interface FooterProps {
  children: ReactNode;
}

const Footer = ({ children }: FooterProps) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Footer;
