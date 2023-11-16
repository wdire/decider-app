"use client";

import React, { useContext, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { createSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { imdbTypeNames } from "@/lib/constants";

export type ImdbContextType = {
  imdbList: string[][] | null;
  setImdbList: React.Dispatch<React.SetStateAction<string[][] | null>>;
  imdbListTable: {
    columns: ColumnDef<any>[];
    data: { [key: string]: string }[];
  } | null;
};

export const ImdbContext = React.createContext<ImdbContextType>({
  imdbList: null,
  setImdbList: () => {},
  imdbListTable: null,
});

export const ImdbProvider = ({ children }: { children: React.ReactNode }) => {
  const [imdbList, setImdbList] = useState<ImdbContextType["imdbList"]>(null);
  const [imdbListTable, setImdbListTable] =
    useState<ImdbContextType["imdbListTable"]>(null);

  useEffect(() => {
    const storageData = localStorage.getItem("imdb_list");

    if (storageData) {
      const newImdbList: ImdbContextType["imdbList"] = JSON.parse(storageData);
      setImdbList(newImdbList);

      // optionally run this when opened table dialog
      setImdbListTable(getTableData(newImdbList));
    }
  }, []);

  const getTableData = (
    resultData: ImdbContextType["imdbList"]
  ): ImdbContextType["imdbListTable"] => {
    if (!resultData) {
      return null;
    }
    console.time("imdb-table-data-create");

    const headers = resultData[0];
    const headersSlug = resultData[0].map((e) => createSlug(e));

    const columns: ColumnDef<any>[] = headers.map((h, i) => {
      const col: ColumnDef<any> = {
        accessorKey: headersSlug[i],
        header: h,
        size: 200,
      };

      if (col.header === "Title Type") {
        col.cell = ({ row }) => {
          const value: keyof typeof imdbTypeNames = row.getValue("title_type");
          return <>{value in imdbTypeNames ? imdbTypeNames[value] : value}</>;
        };

        col.header = "Type";
      } else if (col.accessorKey === "created") {
        col.cell = ({ row }) => {
          return (
            <div className="whitespace-nowrap text-center">
              {row.getValue("created")}
            </div>
          );
        };

        col.header = ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() === "asc" ||
                    column.getIsSorted() === false
                )
              }
            >
              Created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        };
      } else if (col.accessorKey === "title") {
        col.cell = ({ row }) => {
          return (
            <a
              target="_blank"
              href={row.getValue("url")}
              className="font-semibold min-w-[100px] hover:underline"
            >
              {row.getValue("title")}
            </a>
          );
        };
      }

      return col;
    });

    const data = resultData
      .slice(1)
      .filter((r) => r)
      .map((row) => {
        const obj: { [key: string]: string } = {};

        headersSlug.forEach((headerSlug, index) => {
          obj[headerSlug] = row[index];
        });
        return obj;
      });

    console.timeEnd("imdb-table-data-create");

    return {
      columns,
      data,
    };
  };

  return (
    <ImdbContext.Provider value={{ imdbList, setImdbList, imdbListTable }}>
      {children}
    </ImdbContext.Provider>
  );
};

export const useImdbContext = () => {
  return useContext(ImdbContext);
};
