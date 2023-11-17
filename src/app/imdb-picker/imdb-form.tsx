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
import { fileConfigs, imdbListGroups, imdbListUrls } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const imdbFileFormSchema = z
  .object({
    imdb_csv: z.union([
      z
        .any()
        .refine((file) => file instanceof File, "Please upload file")
        .refine(
          (file) => fileConfigs.imdb.allowed_type.includes(file?.type),
          "Only .csv formats are supported."
        )
        .refine(
          (file) => file?.size <= fileConfigs.imdb.max_file_size,
          `Max file size is ${fileConfigs.imdb.max_file_size / 1000000}MB.`
        ),
      z.literal(""),
    ]),

    premade_list_id: z.string(),
  })
  .refine((data) => data.imdb_csv || (data.premade_list_id && !data.imdb_csv), {
    path: ["premade_list_id"],
    message: "You need to select one of these if you don't have a list",
  });

type ImbdFileFormValues = z.infer<typeof imdbFileFormSchema>;

const defaultValues: Partial<ImbdFileFormValues> = {
  imdb_csv: "",
  premade_list_id: "",
};

const FileUploadForm = ({ buttonLabel }: { buttonLabel: string }) => {
  const form = useForm<ImbdFileFormValues>({
    resolver: zodResolver(imdbFileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const { setImdbList } = useImdbContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  const onSubmit = async (data: ImbdFileFormValues) => {
    if (data.imdb_csv) {
      parseCsvListFile(data.imdb_csv);
    } else if (data.premade_list_id) {
      const list_id = data.premade_list_id as keyof typeof imdbListUrls;
      if (list_id in imdbListUrls) {
        const listFileResponse = await axios.get(imdbListUrls[list_id]);

        parseCsvListFile(listFileResponse.data);
      } else {
        form.setError("root", {
          message: "_error_",
        });
        toast({
          title: "Couldn't get list",
          className: "text-red-500",
        });
      }
    } else {
      form.setError("root", {
        message: "_error_",
      });
      toast({
        title: "Error occured while submitting",
        className: "text-red-500",
      });
    }
  };

  const parseCsvListFile = (file: File | string) => {
    return papaparse.parse(file, {
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
            title: "Saved your IMDb list",
            type: "foreground",
            className: "text-green-500",
          });

          setTimeout(() => {
            setDialogOpen(false);
            form.reset();
          }, 1500);
        }
      },
      error: () => {
        toast({
          title: "Error occured while parsing csv file",
          type: "background",
          className: "text-red-500",
        });
      },
    });
  };

  const onDialogOpenChange = (value: boolean) => {
    if (value === false) {
      form.reset();
    }
    setDialogOpen(value);
  };

  return (
    <Dialog modal={false} open={dialogOpen} onOpenChange={onDialogOpenChange}>
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
                      accept={fileConfigs.imdb.allowed_ext}
                      type="file"
                      onChange={(event) => {
                        field.onChange(event?.target?.files?.[0]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    <div className="font-semibold">Find your list:</div>
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
            <FormField
              control={form.control}
              name="premade_list_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Don&apos;t have a list? Choose one of premade lists
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2 flex-wrap">
                      <Select
                        name={field.name}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a list" />
                        </SelectTrigger>
                        <SelectContent>
                          {imdbListGroups.map((group) => {
                            return (
                              <SelectGroup key={group.name}>
                                <SelectLabel>{group.name}</SelectLabel>
                                {group.items.map((item) => {
                                  return (
                                    <SelectItem
                                      key={group.name + "_" + item.id}
                                      value={item.id}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  );
                                })}
                              </SelectGroup>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
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
