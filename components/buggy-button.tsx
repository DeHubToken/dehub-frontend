"use client";

import { useState } from "react";
import { Button } from "@/ui/button";

/**
 * This component is exists only for the purpose of testing error boundaries.
 */
export default function BuggyButton() {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    throw new Error("Oh no! Something went wrong.");
  }

  return (
    <Button variant="destructive" onClick={() => setClicked(true)}>
      Trigger Error
    </Button>
  );
}
