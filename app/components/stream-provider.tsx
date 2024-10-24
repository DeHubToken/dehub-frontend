"use client";

import type { TransitionStartFunction } from "react";

import { useTransition } from "react";

import { createContext } from "@/libs/context";

type State = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

const [Provider, useStreamProvider] = createContext<State>("StreamProvider");

export function StreamProvider(props: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Provider isPending={isPending} startTransition={startTransition}>
      {props.children}
    </Provider>
  );
}

export { useStreamProvider };
