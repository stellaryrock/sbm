"use client";

import { cn } from "@/lib/utils";
import { useState, type PropsWithChildren, type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ToolTip({
  content,
  variant,
  disabled,
  children,
}: PropsWithChildren<{
  content: ReactNode;
  disabled?: boolean;
  variant?: "default" | "destructive";
}>) {
  const [isOpen, setOpen] = useState(false);
  const doOpen = (openState: boolean) => {
    console.log("🚀 ~ doOpen ~ openState:", openState);
    setOpen(disabled ? false : openState);
  };
  return (
    <Tooltip open={isOpen} onOpenChange={doOpen}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className={cn("text-white", variant === "destructive" && "bg-red-500")}
        arrowClassName={cn(
          variant === "destructive" && "fill-destructive bg-destructive",
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
