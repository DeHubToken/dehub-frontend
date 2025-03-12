import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "./input.new";

const meta: Meta<typeof Input> = {
  component: Input,
  title: "UI/Input"
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Primary: Story = {
  render: (args) => <Input {...args} placeholder="Enter your username" />
};
