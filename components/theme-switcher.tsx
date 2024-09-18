"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  console.log({ theme });

  if (theme === "dark") {
    return (
      <button
        onClick={() => setTheme("light")}
        className="bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft text-theme-background dark:text-theme-background rounded-full p-2"
      >
        <MoonIcon className="dark:text-theme-titan-white" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme("dark")}
      className="bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft text-theme-background dark:text-theme-background rounded-full p-2"
    >
      <SunIcon className="text-gray-600" />
    </button>
  );
}
