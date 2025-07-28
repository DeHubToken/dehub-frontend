import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import BackToLinks from "../_components/BackToLinks";
import DataTableTnxListTop10 from "../_components/DataTableTnxListTop";

type Props = {};

const Page = (props: Props) => {
  const links = [
    { href: "/dpay", label: "Back" },
    { href: "/", label: "Back to Home" },
    { href: "/me", label: "Back to Profile" }
  ];
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div className="flex w-full flex-wrap items-center justify-between gap-4 px-6 sm:px-0">
        <h1 className="text-3xl font-semibold">Latest Transactions</h1>
        <BackToLinks links={links} />
      </div>
      <DataTableTnxListTop10 />
    </div>
  );
};

export default Page;
