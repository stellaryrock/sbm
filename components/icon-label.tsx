"use client";

import { cn, divide } from "@/lib/utils";
import { cloneElement, type JSX, type PropsWithChildren } from "react";

type Prop = {
  icon: JSX.Element;
  size?: number;
  noti?: "default" | "destructive" | "success" | "secondary";
  isActive?: boolean;
  isDanger?: boolean;
};

export type IconNoti = "default" | "secondary" | "destructive" | "success";

export default function IconLabel({
  icon,
  size,
  noti,
  isActive,
  isDanger,
  children,
}: PropsWithChildren<Prop>) {
  const lucideIcon = cloneElement(icon, {
    className: cn(
      "text-muted-foreground",
      isDanger && "text-destructive",
      isActive && "fill-primary",
      { "mr-1": !!noti, "mr-[.2rem]": !!children || children === 0 },
      icon.props?.className,
    ),
    size: size ?? (noti ? 25 : 20),
  });

  const cLen = children?.toString().length ?? 1;
  const transX = cLen > 1 ? cLen * 0.5 : cLen;
  const truncated = cLen > 3 && `${divide(Number(children), 1000, 1)}K`;

  return (
    <div className="relative flex items-center text-muted-foreground">
      {lucideIcon}
      {noti ? (
        <small
          className={cn(
            "absolute top-0 right-0 min-w-5 rounded-full p-0 text-center text-sm text-white tracking-tighter ring-1",
            `translate-x-${Math.min(transX, 5)} translate-y-[-0.4rem]`,
            {
              "bg-primary-foreground": noti === "default",
              "bg-muted-foreground": noti === "secondary",
              "bg-destructive": noti === "destructive",
              "bg-green-500": noti === "success",
            },
          )}
        >
          {truncated || children}
        </small>
      ) : (
        children
      )}
    </div>
  );
}
