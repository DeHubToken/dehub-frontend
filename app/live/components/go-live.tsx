"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CreatableTagInput } from "@/components/form/tag-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useUser } from "@/hooks/use-user";

import { getVideoCover } from "@/libs/canvas-preview";
import { formatDateToInputValue } from "@/web3/utils/format";
import { StreamStatus } from "@/configs";
import { createLiveStream } from "@/services/broadcast/broadcast.service";
import { useRouter } from "next/navigation";
import { getAuthObject, getAuthParams } from "@/web3/utils/web3-actions";

const streamStatusOptions = ["OFFLINE", "LIVE", "SCHEDULED"];

const liveStreamSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  thumbnail: z.any({ required_error: "Thumbnail is required" }),
  status: z.enum(["LIVE", "SCHEDULED"]).default(StreamStatus.LIVE),
  categories: z.array(z.string()),
  settings: z.object({
    enableChat: z.boolean().default(true),
    schedule: z.boolean().default(false)
  }),
  scheduledFor: z.date().optional()
});

type LiveStreamFormValues = z.infer<typeof liveStreamSchema>;

type Props = { categories: string[] };

export default function GoLiveForm({ categories }: Props) {
  const { account, chainId, library, user } = useUser();

  const [thumbnailPreview, setThumbnailPreview] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  const [isloading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<LiveStreamFormValues>({
    resolver: zodResolver(liveStreamSchema),
    defaultValues: {
      title: "",
      status: StreamStatus.LIVE,
      description: "",
      thumbnail: "",
      categories: [],
      settings: { enableChat: true, schedule: false }
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
    maxSize: 20_971_520, // 20MB
    onDrop(acceptedFiles) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      setThumbnailFile(file);
      form.setValue("thumbnail", url);
    }
  });

  const createStream = async (data: LiveStreamFormValues) => {
    try {
      setIsLoading(true);
      if (!account || !user) {
        return toast.error("Please connect your wallet");
      }
  
      if (data.settings?.schedule) {
        if (!data.scheduledFor) {
          return toast.error("Please select a date and time for scheduled stream");
        }
        data.status = StreamStatus.SCHEDULED;
      } else {
        delete data.scheduledFor;
      }
      
      const authObject = await getAuthObject(library, account)
      let {thumbnail, ...payload} =  data;
      data = {...payload, ...authObject}
      const response = await createLiveStream(data, thumbnailFile);
  
      if (response.success) {
        toast.success("Stream created successfully! Redirecting...");
        router.push(`/live/${response.data._id}`);
      } else {
        toast.error("Failed to create stream");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-auto min-h-screen w-full space-y-10 py-28 px-4">
      <h1 className="text-4xl font-semibold">Broadcast</h1>
      <Form {...form}>
        {/* <form onSubmit={form.handleSubmit(createStream)} className="space-y-6"> */}
        <div className="flex h-auto w-full flex-wrap items-stretch justify-between gap-6 lg:gap-0">
          <div className="h-auto w-full max-w-full flex-[0_0_100%] space-y-6 rounded-2xl border border-gray-300/25 px-6 pb-6 pt-10 sm:p-10 lg:max-w-[49%] lg:flex-[0_0_49%]">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Stream Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CreatableTagInput
                      isOptionDisabled={() => field.value?.length >= 3}
                      options={categories.map((category) => ({
                        label: category,
                        value: category
                      }))}
                      value={field.value?.map((category) => ({
                        label: category,
                        value: category
                      }))}
                      onOptionSelect={(value) => {
                        if (!value) return;
                        field.onChange(value.map((category) => category.value));
                      }}
                      placeholder="Add Categories"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex h-auto w-full max-w-full flex-[0_0_100%] flex-col items-start justify-start gap-6 rounded-2xl border border-gray-300/25 px-6 pb-6 pt-10 sm:p-10  lg:max-w-[49%] lg:flex-[0_0_49%]">
            <FormField
              control={form.control}
              name="thumbnail"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className="flex h-auto max-h-80 w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed border-gray-300 p-4 hover:border-gray-400"
                    >
                      <input {...getInputProps()} />
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail Preview"
                          className="size-full rounded-3xl object-cover"
                        />
                      ) : (
                          <span className="text-gray-500">Click or drag to upload a thumbnail</span>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex h-auto w-full flex-col items-start justify-start gap-8 rounded-2xl border border-gray-300/25 px-4 pb-6 pt-10 sm:gap-8 sm:p-10">
          <FormField
            control={form.control}
            name="settings.enableChat"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <label htmlFor="enableChat">Enable Chat</label>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="enableChat"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="settings.schedule"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <label htmlFor="schedule">Schedule</label>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) form.setValue("scheduledFor", undefined);
                      }}
                    />
                    {field.value && (
                      <FormField
                        control={form.control}
                        name="scheduledFor"
                        render={({ field: scheduleField }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                {...scheduleField}
                                value={scheduleField.value ? formatDateToInputValue(new Date(scheduleField.value)) : ""}
                                className="w-auto"
                                onChange={(e) => {
                                  const date = e.target.value
                                    ? new Date(e.target.value)
                                    : null;
                                  scheduleField.onChange(date);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={isloading}
          onClick={form.handleSubmit(createStream)}
          variant="gradientOne"
          className="relative h-auto w-full overflow-hidden py-4 text-2xl sm:text-4xl"
        >
          {isloading ? "Creating" : "Create Broadcast"}
        </Button>
      </Form>
    </main>
  );
}
