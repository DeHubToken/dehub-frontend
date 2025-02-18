import type { Preview } from "@storybook/react";

import { withThemeByClassName } from "@storybook/addon-themes";

import { withProviders } from "./decorators";

import "../styles/global.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    actions: { argTypesRegex: "^on[A-Z].*" }
  },
  decorators: [
    withProviders,
    /** https://github.com/storybookjs/storybook/blob/next/code/addons/themes/docs/getting-started/tailwind.md */
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark"
      },
      defaultTheme: "dark"
    })
  ]
};

export default preview;
