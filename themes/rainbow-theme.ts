"use client";

import type { Theme } from "@rainbow-me/rainbowkit";

import { darkTheme } from "@rainbow-me/rainbowkit";
import merge from "lodash/merge";

const rainbowMyTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#860C93",
    accentColorForeground: "#cadadd",
    connectButtonBackground: "#860C93",
    connectButtonText: "#cadadd"
  },
  radii: {
    connectButton: "50px"
  }
} as Theme);

export default rainbowMyTheme;
