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
    <Select defaultValue={range} onValueChange={onValueChange} {...rest}>
      <SelectTrigger className="w-36 rounded-full text-theme-mine-shaft dark:text-theme-titan-white">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent
        ref={(ref) => {
          ref?.addEventListener("touchend", (e) => {
            e.preventDefault();
          });
        }}
      >
        <SelectItem value="day">1 Day</SelectItem>
        <SelectItem value="week">1 Week</SelectItem>
        <SelectItem value="month">1 Month</SelectItem>
        <SelectItem value="year">1 Year</SelectItem>
        {range && <SelectItem value="All">Clear</SelectItem>}
      </SelectContent>
    </Select>
  );
}
