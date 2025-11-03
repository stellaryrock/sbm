"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CircleAlertIcon,
  CircleQuestionMarkIcon,
  OctagonXIcon,
  TriangleIcon,
} from "lucide-react";
import type React from "react";
import { createContext, use, useRef, useState } from "react";

type ContextValueProps = {
  confirm: (options: Options) => Promise<string>;
  alert: (options: Options | null, error?: unknown) => Promise<string>;
  prompt: (options: Options) => Promise<string>;
};

const AlerterContext = createContext<ContextValueProps>({
  confirm: () => new Promise((resolve) => resolve("")),
  alert: () => new Promise((resolve) => resolve("")),
  prompt: () => new Promise((resolve) => resolve("")),
});

type AlertType = "confirm" | "alert" | "prompt";

type Options = {
  title: string;
  description?: string;
  type?: AlertType;
  okText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  placeholder?: string;
};

export default function AlerterProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [options, setOptions] = useState<Options>();
  const [resolver, setResolver] = useState<(value: string) => void>(() => {});

  const inputRef = useRef<HTMLInputElement>(null);

  //   type           destructive              default
  // -------------------------------------------------------
  //  confirm           Triangle              CircleAlert
  //  alert            Octagon-x             CircleAlert
  //  prompt        circle-question-mark     CircleQuestion
  // -------------------------------------------------------

  const variantIcon = () => {
    if (options?.type === "prompt") return <CircleQuestionMarkIcon />;
    if (options?.variant === "destructive")
      return options?.type === "confirm" ? <TriangleIcon /> : <OctagonXIcon />;

    return <CircleAlertIcon />;
  };

  const setup = (options: Options, type: AlertType) => {
    console.log("🚀 ~ setup ~ options:", options);
    return new Promise<string>((resolve) => {
      setOptions({ ...options, type });
      setResolver(() => resolve);
      setOpen(true);
    });
  };

  const makeResolver = (value: string) => {
    setTimeout(resolver, 100, value);
  };

  const confirm = (options: Options) => setup(options, "confirm");
  const alert = (options: Options | null, error?: unknown) =>
    setup(
      options
        ? options
        : { title: error instanceof Error ? error.message : JSON.stringify(error) },
      "alert",
    );
  const prompt = (options: Options) => setup(options, "prompt");

  return (
    <AlerterContext.Provider value={{ confirm, alert, prompt }}>
      {children}

      <AlertDialog open={isOpen} onOpenChange={setOpen}>
        <AlertDialogContent className="w-80 translate-y-[-150px] sm:w-96">
          <AlertDialogHeader>
            <AlertDialogTitle
              className={cn("flex items-center gap-2", {
                "text-destructive/60": options?.variant === "destructive",
              })}
            >
              {variantIcon()}
              {options?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>{options?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          {options?.type === "prompt" && (
            <Input type="text" ref={inputRef} placeholder={options?.placeholder} />
          )}
          <AlertDialogFooter>
            {options?.type !== "alert" && (
              <AlertDialogCancel
                onClick={() => {
                  makeResolver("");
                }}
              >
                {options?.cancelText ?? "Cancel"}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={() =>
                makeResolver(
                  options?.type === "prompt" ? (inputRef.current?.value ?? "") : "OK",
                )
              }
              className={cn(
                options?.variant === "destructive" &&
                  "bg-destructive hover:bg-destructive/90 dark:bg-destructive/60",
              )}
            >
              {options?.okText ?? (options?.type === "alert" ? "Confirm" : "Continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlerterContext.Provider>
  );
}

export const useAlerter = () => use(AlerterContext);
