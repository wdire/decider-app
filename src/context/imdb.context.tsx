"use client";

import React, { useContext, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { getTableData } from "@/lib/imdb/getTableData";

export type ImdbContextType = {
  imdbList: string[][] | null;
  setImdbList: (list: ImdbContextType["imdbList"]) => void;
  imdbListTable: {
    columns: ColumnDef<unknown>[];
    data: { [key: string]: string }[];
  } | null;
  selectionData: {
    title: string;
    poster: string;
    url: string;
  };
  setSelectionData: React.Dispatch<
    React.SetStateAction<ImdbContextType["selectionData"]>
  >;
};

const ImdbContextDefault: ImdbContextType = {
  imdbList: null,
  setImdbList: () => {},
  imdbListTable: null,
  selectionData: {
    title: "",
    poster: "",
    url: "",
  },
  setSelectionData: () => {},
};

export const ImdbContext =
  React.createContext<ImdbContextType>(ImdbContextDefault);

export const ImdbProvider = ({ children }: { children: React.ReactNode }) => {
  const [imdbList, setImdbList] = useState<ImdbContextType["imdbList"]>(null);
  const [imdbListTable, setImdbListTable] =
    useState<ImdbContextType["imdbListTable"]>(null);
  const [selectionData, setSelectionData] = useState(
    ImdbContextDefault.selectionData
  );

  useEffect(() => {
    const storageData = localStorage.getItem("imdb_list");

    if (storageData) {
      const newImdbList: ImdbContextType["imdbList"] = JSON.parse(storageData);
      setImdbList(newImdbList);

      // optionally run this when opened table dialog
      setImdbListTable(getTableData(newImdbList));
    }
  }, []);

  const setImdbListFunc: ImdbContextType["setImdbList"] = (list) => {
    setImdbList(list);
    setImdbListTable(getTableData(list));
  };

  return (
    <ImdbContext.Provider
      value={{
        imdbList,
        setImdbList: setImdbListFunc,
        imdbListTable,
        selectionData,
        setSelectionData,
      }}
    >
      {children}
    </ImdbContext.Provider>
  );
};

export const useImdbContext = () => {
  return useContext(ImdbContext);
};
