"use client";

import { useState } from "react";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ImagePlus, SendHorizonal, Settings } from "lucide-react";

import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn, createAvatarName } from "@/libs/utils";

dayjs.extend(relativeTime);

const messages = Array.from({ length: 50 }).map((_, index) => ({
  id: index + faker.string.uuid(),
  name: faker.internet.userName(),
  avatar: faker.image.avatar(),
  isPro: faker.datatype.boolean(),
  message: faker.lorem.sentence(),
  lastOnline: faker.date.recent(),
  isOnline: faker.datatype.boolean(),
  messages: Array.from({ length: faker.number.int({ min: 0, max: 100 }) }).map((_, index) => ({
    id: index + faker.string.uuid(),
    message: faker.lorem.sentence(),
    isSent: faker.datatype.boolean(),
    date: faker.date.recent(),
    author: faker.datatype.boolean() ? "me" : faker.internet.userName(),
    avatar: faker.image.avatar()
  }))
}));

type TMessage = (typeof messages)[0];

export default function Page() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const message = messages.find((message) => message.id === selectedMessageId);

  return (
    <div className="mt-[calc((80/16)*1rem)] flex max-h-[calc(100vh-80px-30px)] min-h-[calc(100vh-80px-30px)] w-full gap-2 overflow-hidden">
      <div className="flex flex-1 flex-col gap-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">Messages</h1>
          <button>
            <Settings className="text-gray-400" />
          </button>
        </div>

        <div className="flex max-h-[calc(100vh-80px-24px-32px)] flex-col gap-3 overflow-y-scroll">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "relative flex cursor-pointer items-center gap-2 rounded-lg p-3 transition-colors duration-300 hover:dark:bg-theme-mine-shaft",
                selectedMessageId === message.id && "dark:bg-theme-mine-shaft"
              )}
              onClick={() => setSelectedMessageId(message.id)}
            >
              <Avatar>
                <AvatarFallback>{createAvatarName(message.name)}</AvatarFallback>
                <AvatarImage className="object-cover" src={message.avatar} alt={message.name} />
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">{message.name}</span>
                    {message.isPro && <AvatarStar />}
                  </div>
                  <span className="text-xs text-gray-500">
                    {dayjs(message.lastOnline).fromNow()}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">{message.message}</p>
                </div>
              </div>

              {message.isOnline && (
                <div className="absolute right-4 top-4 size-1 rounded-full bg-green-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 px-6 pt-6">
        {!message && (
          <div className="grid w-full place-items-center">
            <span className="text-lg text-gray-400">Select conversation from left</span>
          </div>
        )}

        {message && (
          <div className="w-full">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{createAvatarName(message.name)}</AvatarFallback>
                  <AvatarImage
                    className="size-12 object-cover"
                    src={message.avatar}
                    alt={message.name}
                  />
                </Avatar>
                <span className="text-2xl font-bold">{message.name}</span>
                {message.isPro && <AvatarStar />}
              </div>
            </div>

            <div
              className={cn(
                "max-h-[calc(100vh-80px-24px-150px)] min-h-[calc(100%-40px-100px)] overflow-y-scroll",
                message.messages.length === 0 && "flex flex-col items-center justify-center"
              )}
            >
              {message.messages.length === 0 && (
                <span className="text-lg text-gray-400">
                  Start conversation with {message.name} by sending a message
                </span>
              )}

              {message.messages.map((message) => (
                <div key={message.id} className="mb-4">
                  {message.author === "me" && <MyMessage message={message} />}
                  {message.author !== "me" && <UserMessage message={message} />}
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 flex h-[calc((80/16)*1rem)] w-full items-center gap-5 rounded-lg border px-5 dark:border-theme-mine-shaft-dark dark:bg-theme-background">
              <Input
                placeholder="Type here..."
                className="h-10 rounded-full text-sm placeholder:text-sm dark:bg-theme-mine-shaft"
              />

              <div className="flex flex-1 items-center gap-3">
                <button className="size-10">
                  <ImagePlus className="size-6 text-gray-600 dark:text-gray-300" />
                </button>
                <Button variant="gradientOne" className="size-10 p-0">
                  <SendHorizonal className="size-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MyMessage(props: { message: TMessage["messages"][0] }) {
  const { message } = props;
  return (
    <div className="flex w-full justify-end">
      <div className="flex max-w-96 flex-col items-end gap-1">
        <span className="pr-4 text-xs text-gray-400">{dayjs(message.date).fromNow()}</span>
        <div className="flex items-end gap-3">
          <div className="rounded-l-[20px] rounded-tr-[20px] px-4 py-3 dark:bg-theme-mine-shaft-dark">
            <p className="text-sm text-gray-200">{message.message}</p>
          </div>
          <Avatar className="size-8">
            <AvatarFallback>{createAvatarName(message.author)}</AvatarFallback>
            <AvatarImage className="object-cover" src={message.avatar} alt={message.author} />
          </Avatar>
        </div>
      </div>
    </div>
  );
}

function UserMessage(props: { message: TMessage["messages"][0] }) {
  const { message } = props;
  return (
    <div className="flex w-full justify-start">
      <div className="flex max-w-96 flex-col items-end gap-1">
        <span className="pr-4 text-xs text-gray-400">{dayjs(message.date).fromNow()}</span>
        <div className="flex items-end gap-3">
          <Avatar className="size-8">
            <AvatarFallback>{createAvatarName(message.author)}</AvatarFallback>
            <AvatarImage className="object-cover" src={message.avatar} alt={message.author} />
          </Avatar>
          <div className="rounded-r-[20px] rounded-tl-[20px] px-4 py-3 dark:bg-theme-mine-shaft-dark">
            <p className="text-sm text-gray-200">{message.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
