import type { Preview } from "@storybook/react";

import { withThemeByClassName } from "@storybook/addon-themes";

import "../styles/global.css";

export const decorators = [
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark"
    },
    defaultTheme: "light"
  })
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
