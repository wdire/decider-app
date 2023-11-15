"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { HomeIcon, FilmIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();

  const linkClass = clsx("w-full justify-start");
  const buttonClass = clsx("w-full justify-start");

  return (
    <aside className={cn("sm:pb-12 flex items-center sm:w-52 flex-shrink-0")}>
      <div className="space-y-4 py-4 w-full">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Decider App
          </h2>

          <div className="flex flex-row flex-wrap sm:flex-col gap-1 justify-stretch">
            <Link href="/" className={linkClass}>
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                className={buttonClass}
              >
                <HomeIcon width="18px" height="18px" className="mr-1.5" />
                Home
              </Button>
            </Link>

            <Link href="/imdb-picker" className={linkClass}>
              <Button
                variant={pathname === "/imdb-picker" ? "secondary" : "ghost"}
                className={buttonClass}
              >
                <FilmIcon width="18px" height="18px" className="mr-1.5" />
                IMDb Picker
              </Button>
            </Link>
            <Button variant={"ghost"} className={buttonClass}>
              more will come...
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
