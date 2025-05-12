import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import DataTableTnxListTop10 from "../_components/DataTableTnxListTop";
import BackToLinks from "../_components/BackToLinks";

type Props = {};

const Page = (props: Props) => {
  const links=[
    { href: "/", label: "Back to Home" },
    { href: "/dpay", label: "Back to Dpay" },
    { href: "/me", label: "Back to Profile" },
  ]
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <BackToLinks links={links}/>
      <DataTableTnxListTop10 />
    </div>
  );
};

export default Page;
