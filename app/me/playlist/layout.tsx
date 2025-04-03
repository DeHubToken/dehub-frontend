import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return <div className="w-full">{props.children}</div>;
}
