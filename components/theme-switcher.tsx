"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  if (theme === "dark") {
    return (
      <button
        onClick={() => setTheme("light")}
        className="rounded-full bg-theme-mine-shaft-dark p-2 text-theme-background sm:p-3"
      >
        <MoonIcon className="size-3 dark:text-theme-titan-white sm:size-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme("dark")}
      className="rounded-full bg-theme-neutrals-800 p-2 text-theme-background dark:bg-theme-mine-shaft dark:text-theme-background sm:p-3"
    >
      <SunIcon className="size-3 text-gray-600 sm:size-5" />
    </button>
  );
}
