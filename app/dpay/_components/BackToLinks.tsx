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
    <div className="flex gap-3 flex-wrap">
      {links.map((link, index) => (
        <Link key={index} href={link.href}>
          <Button variant="outline" className="flex w-full items-center gap-2 sm:w-auto">
             {link.label}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default BackToLinks;
