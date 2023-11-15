import { ImdbProvider } from "@/context/imdb.context";
import React from "react";

const Layout = ({ children }: { children: React.JSX.Element }) => {
  return <ImdbProvider>{children}</ImdbProvider>;
};

export default Layout;
