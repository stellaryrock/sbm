"use client";

import type { ComponentProps, PropsWithChildren } from "react";
import { Button } from "./ui/button";

type Props = {
  serverAction: () => void;
} & ComponentProps<typeof Button>;

export function ActionButton({
  serverAction,
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <Button onClick={serverAction} {...props}>
      {children}
    </Button>
  );
}
