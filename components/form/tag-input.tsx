"use client";

import type { ClassNamesConfig } from "react-select";

import React from "react";
import Select from "react-select";
import Creatable from "react-select/creatable";

import { cn } from "@/libs/utils";

export interface TOption {
  readonly value: string;
  readonly label: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

const classNames: ClassNamesConfig<TOption, true> = {
  control: () => "group bg-theme-mine-shaft-dark rounded-full p-3 h-auto react-select-control",
  valueContainer: () => "value-container gap-2",
  singleValue: () => "single-value",
  placeholder: () => "placeholder text-theme-titan-white/40 text-sm",
  option: (props) =>
    cn(
      "option inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium transition-colors hover:bg-theme-cloud-burst h-10 px-4 py-2 cursor-pointer",
      props.isFocused && "bg-theme-cloud-burst",
      props.isDisabled &&
        "cursor-not-allowed dark:text-theme-titan-white/50 text-theme-mine-shaft/50"
    ),
  noOptionsMessage: () => "no-options-message p-7 text-base",
  multiValueRemove: () => "multi-value-remove",
  multiValueLabel: () => "multi-value-label",
  multiValue: () =>
    "multi-value rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-theme-background bg-gray-200 text-secondary-foreground border border-gray-200 dark:border-theme-mine-shaft hover:bg-secondary/80 px-4 py-0.5",
  menuPortal: () => "menu-portal",
  menuList: () => "menu-list",
  menu: () =>
    "menu w-full rounded-md border border-theme-mine-shaft bg-theme-mine-shaft-dark border-gray-200 bg-theme-mine-shaft-dark animate-in",
  loadingMessage: () => "loading-message",
  loadingIndicator: () => "loading-indicator",
  input: () => "input",
  container: () => "bg-transparent w-full react-select-container",
  group: () => "react-select-group",
  clearIndicator: () => "clear-indicator",
  dropdownIndicator: () => "dropdown-indicator",
  indicatorSeparator: () => "indicator-separator",
  groupHeading: () => "group-heading",
  indicatorsContainer: () => "indicators-container"
};

type Props = React.ComponentProps<typeof Select<TOption>> & {
  onOptionSelect: (option: TOption[]) => void;
};

export function TagInput(props: Props) {
  const { options, onOptionSelect, isDisabled = false, isOptionDisabled } = props;
  return (
    <Select
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      isOptionDisabled={isOptionDisabled}
      classNames={classNames}
      isMulti
      unstyled
      isDisabled={isDisabled}
      styles={{
        option: (base, props) => ({
          ...base,
          cursor: props.isDisabled ? "not-allowed" : "pointer"
        })
      }}
      onChange={(value) => onOptionSelect(value as TOption[])}
      instanceId="tag-input"
    />
  );
}

export function CreatableTagInput(props: Props) {
  const { options, onOptionSelect, isDisabled = false, isOptionDisabled } = props;

  return (
    <Creatable
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      isOptionDisabled={isOptionDisabled}
      classNames={classNames}
      isMulti
      unstyled
      isDisabled={isDisabled}
      placeholder="Select or Type"
      styles={{
        option: (base, props) => ({
          ...base,
          cursor: props.isDisabled ? "not-allowed" : "pointer"
        })
      }}
      onChange={(value) => onOptionSelect(value as TOption[])}
      instanceId="creatable-tag-input"
    />
  );
}
