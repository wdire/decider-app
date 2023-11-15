"use client";

import React, { useContext, useEffect, useState } from "react";

type ImdbContextType = {
  imdbList: string[][] | null;
  setImdbList: React.Dispatch<React.SetStateAction<string[][] | null>>;
};

export const ImdbContext = React.createContext<ImdbContextType>({
  imdbList: null,
  setImdbList: () => {},
});

export const ImdbProvider = ({ children }: { children: React.JSX.Element }) => {
  const [imdbList, setImdbList] = useState<ImdbContextType["imdbList"]>(null);

  useEffect(() => {
    const storageData = localStorage.getItem("imdb_list");

    if (storageData) {
      setImdbList(JSON.parse(storageData));
    }
  }, []);

  return (
    <ImdbContext.Provider value={{ imdbList, setImdbList }}>
      {children}
    </ImdbContext.Provider>
  );
};

export const useImdbContext = () => {
  return useContext(ImdbContext);
};
