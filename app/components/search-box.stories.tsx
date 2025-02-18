import type { Meta, StoryObj } from "@storybook/react";
import { withProviders } from "../../.storybook/decorators";
import { SearchBox } from "./search-box";

const meta: Meta<typeof SearchBox> = {
  component: SearchBox,
  title: "Components/SearchBox",
};

export default meta;

type Story = StoryObj<typeof SearchBox>;

export const Default: Story = {
  args: {
    category: "videos",
    type: "search", 
    range: "all",
    q: "test search"
  }
};

