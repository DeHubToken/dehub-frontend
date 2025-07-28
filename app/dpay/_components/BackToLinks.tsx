import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type LinkItem = {
  href: string;
  label: string;
};

type Props = {
  links: LinkItem[];
};

const BackToLinks = ({ links }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, index) => (
        <Link key={index} href={link.href}>
          <Button
            variant={link.label === "Show All" ? "gradientOne" : "outline"}
            className="w-full rounded-full sm:w-auto"
          >
            {link.label}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default BackToLinks;
