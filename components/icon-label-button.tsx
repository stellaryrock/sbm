"use client";

import { cn } from "@/lib/utils";
import type { JSX, MouseEvent, PropsWithChildren } from "react";
import IconLabel from "./icon-label";
import ToolTip from "./tool-tip";
import { Button } from "./ui/button";

type Props = {
  icon: JSX.Element;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isActive?: boolean;
  isDanger?: boolean;
  tooltip?: string;
  disabled?: boolean;
};

export default function IconLabelButton({
  icon,
  onClick,
  isActive,
  isDanger,
  tooltip,
  disabled,
  children,
}: PropsWithChildren<Props>) {
  return (
    <ToolTip
      variant={isDanger ? "destructive" : "default"}
      disabled={!tooltip}
      content={tooltip}
    >
      <Button
        onClick={onClick}
        variant={"ghost"}
        disabled={disabled}
        className={cn(
          "h-[80%] px-1 py-1 dark:hover:bg-muted-foreground/30",
          isDanger && "text-destructive",
          { "px-2": !!children || children === 0 },
        )}
      >
        <IconLabel icon={icon} isActive={isActive} isDanger={isDanger}>
          {children}
        </IconLabel>
      </Button>
    </ToolTip>
  );
}
