"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      className="rounded-full bg-theme-neutrals-800 p-2 text-theme-background dark:bg-theme-mine-shaft-dark dark:text-theme-background sm:p-3"
    >
      <MoonIcon className="hidden size-3 dark:block dark:text-theme-titan-white sm:size-5" />
      <SunIcon className="block size-3 text-gray-600 dark:hidden sm:size-5" />
    </button>
  );
}
