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
        className="rounded-full bg-theme-mine-shaft-dark p-3 text-theme-background dark:bg-theme-mine-shaft dark:text-theme-background"
      >
        <MoonIcon className="dark:text-theme-titan-white" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme("dark")}
      className="rounded-full bg-theme-mine-shaft-dark p-3 text-theme-background dark:bg-theme-mine-shaft dark:text-theme-background"
    >
      <SunIcon className="text-gray-600" />
    </button>
  );
}
