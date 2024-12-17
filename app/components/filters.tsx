"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { parse, stringify } from "querystring";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { useStreamProvider } from "./stream-provider";

type Props = React.ComponentProps<typeof Select> & {
  range?: string;
};

export function StreamRangeFilter(props: Props) {
  const { range, ...rest } = props;

  const { startTransition } = useStreamProvider("StreamRangeFilter");
  const router = useRouter();
  const searchParams = useSearchParams().toString();

  const onValueChange = (value: string) => {
    startTransition(() => {
      const q = parse(searchParams);
      if (value === "All") {
        delete q.range;
        const query = stringify(q);
        return router.push(`/?${query}`);
      }

      q.range = value;
      const query = stringify(q);
      return router.push(`/?${query}`);
    });
  };

  return (
    <select
      className="w-36 rounded-full text-theme-mine-shaft dark:bg-theme-mine-shaft dark:text-theme-titan-white"
      value={range}
      onChange={(e) => {
        onValueChange(e.target.value);
      }}
    >
      <option value="">Filter</option>
      <option value="day">1 Day</option>
      <option value="week">1 Week</option>
      <option value="month">1 Month</option>
      <option value="year">1 Year</option>
      {range && <option value="All">Clear</option>}
    </select>
  );
}
