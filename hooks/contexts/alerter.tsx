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
import { cn } from "@/lib/utils";
import {
  CircleAlertIcon,
  CircleQuestionMarkIcon,
  OctagonXIcon,
  TriangleIcon,
} from "lucide-react";
import type React from "react";
import { createContext, use, useState } from "react";

type ContextValueProps = {
  confirm: (options: Options) => Promise<string>;
  alert: (options: Options) => Promise<string>;
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
};

export default function AlerterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);
  const [options, setOptions] = useState<Options>();
  const [resolver, setResolver] = useState<(value: string) => void>(() => {});

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

  const setup = (options: Options, type: AlertType) =>
    new Promise<string>((resolve) => {
      setOptions({ ...options, type });
      setResolver(() => resolve);
      setOpen(true);
    });

  const makeResolver = (value: string) => {
    setTimeout(resolver, 100, value);
  };

  const confirm = (options: Options) => setup(options, "confirm");
  const alert = (options: Options) => setup(options, "alert");
  const prompt = (options: Options) => setup(options, "prompt");

  return (
    <AlerterContext.Provider value={{ confirm, alert, prompt }}>
      {children}

      <AlertDialog open={isOpen} onOpenChange={setOpen}>
        <AlertDialogContent className="w-80 translate-y-[-100px] sm:w-96">
          <AlertDialogHeader>
            <AlertDialogTitle
              className={cn("flex items-center gap-2", {
                "text-destructive/60": options?.variant === "destructive",
              })}
            >
              {variantIcon()}
              {options?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {options?.type === "alert" && (
              <AlertDialogCancel
                onClick={() => {
                  console.log("Resolver:", resolver);
                  makeResolver("");
                }}
              >
                Cancel
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={() => makeResolver("Ok")}
              className={cn(
                options?.variant === "destructive" &&
                  "bg-destructive/60 hover:bg-destructive/90 dark:bg-destructive/60",
              )}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlerterContext.Provider>
  );
}

export const useAlerter = () => use(AlerterContext);
