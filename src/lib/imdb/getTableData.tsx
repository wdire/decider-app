import { Button } from "@/components/ui/button";
import { ImdbContextType } from "@/context/imdb.context";
import { ColumnDef } from "@tanstack/react-table";
import { imdbTypeNames } from "../constants";
import { createSlug } from "../utils";
import { ArrowUpDown } from "lucide-react";

export const getTableData = (
  resultData: ImdbContextType["imdbList"]
): ImdbContextType["imdbListTable"] => {
  if (!resultData) {
    return null;
  }
  console.time("imdb-table-data-create");

  const headers = resultData[0];
  const headersSlug = resultData[0].map((e) => createSlug(e));

  const columns: ColumnDef<unknown>[] = headers.map((h, i) => {
    const col: ColumnDef<unknown> = {
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
                column.getIsSorted() === "asc" || column.getIsSorted() === false
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
            className="inline-block font-semibold min-w-[100px] hover:underline"
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
