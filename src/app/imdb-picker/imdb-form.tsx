"use client";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { fileConfigs } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import papaparse from "papaparse";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useImdbContext } from "@/context/imdb.context";

const imdbFileFormSchema = z.object({
  imdb_csv: z
    .any()
    .refine((file) => file instanceof File, "Please upload file")
    .refine(
      (file) => file?.size <= fileConfigs.imdb.max_file_size,
      `Max file size is ${fileConfigs.imdb.max_file_size / 100000}MB.`
    )
    .refine(
      (file) => fileConfigs.imdb.allowed_type.includes(file?.type),
      "Only .csv formats are supported."
    ),
});

type ImbdFileFormValues = z.infer<typeof imdbFileFormSchema>;

const defaultValues: Partial<ImbdFileFormValues> = {
  imdb_csv: "",
};

const FileUploadForm = ({ buttonLabel }: { buttonLabel: string }) => {
  const form = useForm<ImbdFileFormValues>({
    resolver: zodResolver(imdbFileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const { setImdbList } = useImdbContext();

  const onSubmit = async (data: ImbdFileFormValues) => {
    papaparse.parse(data.imdb_csv, {
      complete: (results) => {
        if (results?.data) {
          const resultData: string[][] = Object.values({
            ...results.data,
          }) as string[][];

          if (resultData?.[resultData.length - 1]?.length === 1) {
            delete resultData?.[resultData.length - 1];
          }

          setImdbList(resultData);
          localStorage.setItem("imdb_list", JSON.stringify(resultData));
          toast({
            title: "Saved your imdb list",
            type: "foreground",
          });
        }
      },
      error: () => {
        toast({
          title: "Error occured while parsing csv file",
          type: "background",
        });
      },
    });
  };

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Upload IMDb List
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="imdb_csv"
              rules={{}}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMDb list export file (*.csv)</FormLabel>
                  <FormControl>
                    <Input
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={form.formState.isSubmitSuccessful}
                      placeholder="Select file"
                      type="file"
                      onChange={(event) => {
                        field.onChange(event?.target?.files?.[0]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    <ol className="list-disc pl-5">
                      <li>
                        On IMDb, go to “Your Lists” from the user menu (top
                        right)
                      </li>
                      <li>Click “Your Watchlist” (under Your Lists)</li>
                      <li>
                        <b>Scroll to the bottom of the page</b>, then select
                        “Export this list”
                      </li>
                    </ol>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          {form.formState.isSubmitSuccessful ? (
            <div className="text-green-500">Saved successfully</div>
          ) : (
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadForm;
