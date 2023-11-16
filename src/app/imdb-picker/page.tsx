"use client";

import FileUploadForm from "./imdb-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useImdbContext } from "@/context/imdb.context";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import getMetadata from "../services/getMetadata";
import Loading from "@/components/loading";
import Image from "next/image";
import ImdbListDialog from "./imdb-list-dialog";

export default function ImdbPickerPage() {
  const { imdbList, selectionData, setSelectionData } = useImdbContext();

  const { mutateAsync: mutateGetMetadata, isPending: isMetadataPending } =
    useMutation({
      mutationFn: getMetadata,
    });

  const handleRedButtonClick = useCallback(async () => {
    if (!imdbList) {
      toast({
        title: "You need to upload your IMDb list first",
      });
      return;
    }

    const firstValue = imdbList[0];
    const otherValues = [...imdbList];
    delete otherValues[0];
    const titleIndex = firstValue.findIndex((i) => i.toLowerCase() === "title");
    const urlIndex = firstValue.findIndex((i) => i.toLowerCase() === "url");

    const randomSelection =
      otherValues[Math.floor(Math.random() * otherValues.length)];

    console.log(randomSelection);

    const metadataResponse = await mutateGetMetadata(randomSelection[urlIndex]);

    if (metadataResponse.data?.title && metadataResponse.data?.poster) {
      setSelectionData({
        title: metadataResponse.data.title.replace(" - IMDb", ""),
        poster: metadataResponse.data.poster,
        url: randomSelection[urlIndex],
      });
    } else {
      setSelectionData({
        title: randomSelection[titleIndex],
        poster: "",
        url: randomSelection[urlIndex],
      });
    }
  }, [imdbList, mutateGetMetadata, setSelectionData]);

  const renderButtonAndResult = useMemo(() => {
    if (isMetadataPending) {
      return (
        <div className="w-[220px] h-[220px] flex flex-col justify-center items-center gap-2">
          <Loading />
          Lucky numbers are..
        </div>
      );
    } else if (selectionData.title) {
      return (
        <div className="w-[220px]">
          {selectionData.poster && (
            <a href={selectionData.url} target="_blank">
              <Image
                src={selectionData.poster}
                width={220}
                height={324}
                alt={`${selectionData.title} poster`}
                className="object-contain h-auto"
              />
            </a>
          )}
          <div className="inline-block text-lg font-semibold mt-2">
            {selectionData.title}
          </div>
          <div className="text-sm mt-3">- Quick Google</div>
          <div className="flex gap-3 mt-1.5 text-sm">
            <span>
              <a
                href={`https://www.google.com/search?q=${selectionData.title} justwatch`}
                target="_blank"
                className="underline"
              >
                JustWatch
              </a>
              {" - "}Available platforms
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col w-[220px] relative">
          <Button
            onClick={() => handleRedButtonClick()}
            className="bg-red-500 hover:bg-red-400 active:border-4 active:border-black/50 w-[220px] h-[220px]"
          >
            <div>
              <div className="text-[12px]">Big Red Decider Button</div>
              <br />
              <div>
                Press here to choose <br />
                your fated selection
              </div>
              <br />
              <br />
            </div>
          </Button>
          <Label className="text-sm mt-3 w-[200px]">
            <Checkbox className="m-1" /> I oath that I will watch whatever comes
            out from the mystery button
          </Label>
        </div>
      );
    }
  }, [selectionData, isMetadataPending, handleRedButtonClick]);

  return (
    <div className="flex items-center h-full">
      <div className="md:h-[350px] flex flex-wrap pt-2 pb-14 px-7 sm:p-7 gap-10 sm:mb-0">
        <div>
          <div className="text-2xl font-semibold mb-1.5">IMDb Picker</div>
          <p className="text-gray-800 mb-6 sm:max-w-[385px] max-w-full mx-auto">
            You couldn&apos;t <i>decide</i> what to watch and didn&apos;t watch
            anything in the end?
            <br />
            <br />
            Here you can drain your list one by one if you stick with whatever
            comes out of the box.
          </p>
          {imdbList && imdbList?.length > 0 && (
            <div className="mb-2">
              You have uploaded <b>{imdbList?.length - 2}</b> items from IMDb
            </div>
          )}
          <div className="flex gap-3">
            <FileUploadForm
              buttonLabel={
                imdbList && imdbList?.length > 0
                  ? "Replace IMDb List"
                  : "Upload IMDb List"
              }
            />

            {imdbList && imdbList?.length > 0 && <ImdbListDialog />}
          </div>
        </div>
        {renderButtonAndResult}
      </div>
    </div>
  );
}
