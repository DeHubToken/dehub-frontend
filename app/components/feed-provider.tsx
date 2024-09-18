"use client";

import type { TransitionStartFunction } from "react";

import { useTransition } from "react";

import { createContext } from "@/libs/context";

type State = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

const [Provider, useFeedProvider] = createContext<State>("FeedProvider");

export function FeedProvider(props: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Provider isPending={isPending} startTransition={startTransition}>
      {props.children}
    </Provider>
  );
}

export { useFeedProvider };
