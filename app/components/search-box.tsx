"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { Search } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { useMediaQuery } from "@/hooks/use-media-query";

import { search } from "./action";
import { useFeedProvider } from "./feed-provider";

/* ----------------------------------------------------------------------------------------------- */

export function SearchBox(props: { category?: string; type?: string; range?: string; q?: string }) {
  const { category, type = "search", range, q } = props;

  const [text, setText] = useState(q || "");
  const { startTransition, isPending } = useFeedProvider("SearchBox");

  const action: () => void = () => {
    startTransition(() => {
      search({ category, type, range, q: text });
    });
  };

  return (
    <form className="relative hidden w-full max-w-[39%] flex-[39%] md:block" action={action}>
      <input
        type="text"
        name="search"
        className="block h-12 w-full rounded-full border-none bg-theme-mine-shaft-dark px-6 py-2 text-sm outline-none dark:bg-theme-mine-shaft placeholder:dark:text-gray-400"
        placeholder="Search"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        variant="gradientOne"
        size="icon_sm"
        className="absolute right-3 top-1/2 -translate-y-1/2"
        type="submit"
        disabled={isPending}
      >
        {isPending && <Spinner />}
        {!isPending && <Search className="scale-125" />}
      </Button>
    </form>
  );
}

export function SearchModal() {
  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const category = searchParams.get("category") || undefined;
  const type = searchParams.get("type") || undefined;
  const range = searchParams.get("range") || undefined;
  const q = searchParams.get("q") || undefined;

  const action: () => void = () => {
    startTransition(() => {
      search({ category, type, range, q: text });
      setOpen(false);
    });
  };

  function onOpenChange(open: boolean) {
    if (isPending) return;
    setOpen(open);
  }

  useEffect(() => {
    setText(q || "");
  }, [q]);

  if (!isSmallScreen) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon_sm" className="rounded-full">
          <Search className="scale-125 text-gray-400 dark:text-theme-titan-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] gap-10 rounded-2xl p-6 sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle>Search Uploads</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col items-center justify-center gap-4" action={action}>
          <Input
            type="text"
            name="search"
            className="block h-12 w-full rounded-full border-none px-6 py-2 text-sm outline-none dark:bg-theme-mine-shaft"
            placeholder="Search"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button variant="gradientOne" type="submit" className="w-full gap-2" disabled={isPending}>
            <Search /> {isPending ? "Searching..." : "Search"}
            {isPending && <Spinner />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
