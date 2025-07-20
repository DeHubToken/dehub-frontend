"use client";

import type { Select } from "@/components/ui/select";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parse, stringify } from "querystring";
import { CheckCheck, History, ListFilter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger
} from "@/components/ui/sheet";

import { useStreamProvider } from "./stream-provider";

type Props = React.ComponentProps<typeof Select> & {
  range?: string;
  sort?: string;
  type?: string;
  categories: string[];
  base?: string;
  tab?: string;
};

export function FeedRangeFilterMobile(props: Props) {
  const { range, sort: sortBy, type: defaultType, categories, base, tab } = props;
  const defaults = {
    type: defaultType ?? "trends",
    sort: "",
    date: ""
  };

  const { startTransition } = useStreamProvider("FeedRangeFilterMobile");
  const router = useRouter();
  const searchParams = useSearchParams().toString();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(range);
  const [type, setType] = useState(defaultType);
  const [sort, setSort] = useState(sortBy);
  const [category, setCategory] = useState("");

  const onApply = () => {
    setOpen(false);
    startTransition(() => {
      const q = parse(searchParams);
      q.range = date;
      q.type = type;
      q.sort = sort;
      q.tab = tab;
      if (category) {
        q.category = category;
      } else {
        delete q.category;
      }
      const query = stringify(q);

      return router.push(`${base ?? ""}/?${query}`, { scroll: tab == "" });
    });
  };

  const onReset = () => {
    setDate("");
    setType(defaults.type);
    setCategory("");
    setSort(defaults.sort);
    setOpen(false);
    startTransition(() => {
      const q = parse(searchParams);
      q.type = defaults.type;
      delete q.range;
      delete q.sort;
      delete q.category;
      const query = stringify(q);
      return router.push(`${base ?? "/"}?${query}`, { scroll: tab == "" });
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="flex">
        <Badge
          variant="default"
          className="h-8 cursor-pointer gap-1 bg-neutral-800 bg-theme-neutrals-800 px-4 py-2 text-[11px] text-theme-neutrals-400"
        >
          <ListFilter className="size-3" /> Sort
        </Badge>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="text-theme-monochrome-300 flex flex-col items-start gap-5 rounded-t-2xl border-none bg-background px-0 pb-0 pt-14"
      >
        {/* hidden parts */}
        <div className="absolute -top-1 left-1/2 h-2 w-20 -translate-x-1/2 rounded-md bg-theme-mine-shaft dark:bg-theme-mine-shaft" />
        <SheetHeader className="hidden">
          <SheetDescription className="hidden" />
        </SheetHeader>

        {/* filters */}
        <div className="grid w-full grid-cols-2 items-center px-8">
          <h1 className="text-theme-monochrome-300 text-2xl font-medium">Sort by</h1>

          <select
            className="w-full rounded-full border-none bg-theme-mine-shaft-dark py-2 pl-5 text-lg placeholder:text-muted-foreground dark:bg-theme-mine-shaft"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Select</option>
            <option value="new">Newest</option>
            <option value="views">Most views</option>
          </select>
        </div>

        <div className="grid w-full grid-cols-2 items-center px-8">
          <h1 className="text-theme-monochrome-300 text-2xl font-medium">Date</h1>

          <select
            className="w-full rounded-full border-none bg-theme-mine-shaft-dark py-2 pl-5 text-lg placeholder:text-muted-foreground dark:bg-theme-mine-shaft"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            <option value="">Select</option>
            <option value="day">1 Day</option>
            <option value="week">1 Week</option>
            <option value="month">1 Month</option>
            <option value="year">1 Year</option>
          </select>
        </div>

        <div className="grid w-full grid-cols-2 items-center px-8">
          <h1 className="text-theme-monochrome-300 text-2xl font-medium">Type</h1>

          <select
            className="w-full rounded-full border-none bg-theme-mine-shaft-dark py-2 pl-5 text-lg placeholder:text-muted-foreground dark:bg-theme-mine-shaft"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All</option>
            <option value="normal">Normal</option>
            <option value="locked">Exclusive</option>
            <option value="bounty">Watch2Earn</option>
            <option value="ppv">Pay Per View</option>
            <option value="reports">Users Report</option>
          </select>
        </div>

        <div className="grid w-full grid-cols-2 items-center px-8">
          <h1 className="text-theme-monochrome-300 text-2xl font-medium">Category</h1>

          <select
            className="w-full rounded-full border-none bg-theme-mine-shaft-dark py-2 pl-5 text-lg placeholder:text-muted-foreground dark:bg-theme-mine-shaft"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid w-full grid-cols-2 items-center px-8">
          <h1 className="text-theme-monochrome-300 text-2xl font-medium">Format</h1>

          <select
            className="w-full rounded-full border-none bg-theme-mine-shaft-dark py-2 pl-5 text-lg placeholder:text-muted-foreground dark:bg-theme-mine-shaft"
            value="All"
          >
            <option value="All">All</option>
            <option value="Standard">Standard</option>
            <option value="LiveStream">Live Stream</option>
            <option value="VR">VR</option>
          </select>
        </div>

        <div className="grid w-full grid-cols-2 items-center px-8">
          <h1 className="text-theme-monochrome-300 text-2xl font-medium">Quality</h1>

          <select
            className="w-full rounded-full border-none bg-theme-mine-shaft-dark py-2 pl-5 text-lg placeholder:text-muted-foreground dark:bg-theme-mine-shaft"
            value="All"
          >
            <option value="All">All</option>
            <option value="SD">SD</option>
            <option value="HD">HD</option>
            <option value="4K">4K</option>
          </select>
        </div>

        <SheetFooter className="border-theme-monochrome-600 mt-10 grid w-full grid-cols-2 border-t">
          <Button
            variant="ghost"
            className="border-theme-monochrome-600 text-theme-monochrome-300 w-full gap-3 rounded-none border-r py-8 text-xl"
            onClick={onReset}
          >
            <History className="text-theme-monochrome-300 size-5" />
            Reset All
          </Button>
          <Button
            variant="ghost"
            className="text-theme-monochrome-300 w-full gap-3 rounded-none py-8 text-xl"
            onClick={onApply}
          >
            <CheckCheck className="text-theme-monochrome-300 size-5" />
            Apply
          </Button>
        </SheetFooter>

        {/* hider */}
        <div className="absolute right-3 top-3 z-[2] size-6 bg-theme-mine-shaft-dark" />
      </SheetContent>
    </Sheet>
  );
}
