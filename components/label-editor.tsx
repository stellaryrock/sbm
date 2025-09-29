"use client";

import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { CheckLineIcon, UndoDotIcon } from "lucide-react";
import {
  useRef,
  useState,
  useTransition,
  type ComponentProps,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import LabelInput, { type LabelInputProps } from "./label-input";
import { Button } from "./ui/button";

type Props = {
  saveAction: (formData: FormData) => Promise<ValidError | undefined>;
};

export default function LabelEditor({
  saveAction,
  label,
  type,
  name,
  ref,
  focus,
  defaultValue,
  error,
  placeholder,
  className,
  inputClassName,
  ...props
}: ComponentProps<"input"> & LabelInputProps & Props) {
  const [isDirty, setDirty] = useState(false);
  const [validError, setValidError] = useState<ValidError>();
  const labelInputRef = useRef<HTMLInputElement>(null);

  const prev = useRef<string[]>([]);
  const next = useRef<string[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const keyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    next.current.push(e.key);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (next.current.join() !== prev.current.join()) {
        setDirty(true);
        prev.current = [...next.current];
      } else {
        setDirty(false);
      }
    }, 500);
  };

  const [isPending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const err = await saveAction(formData);
      if (err) setValidError(err);
      else setDirty(false);
    });
  };

  return (
    <form
      onSubmit={submitHandler}
      onResetCapture={() => setDirty(false)}
      className="flex flex-nowrap gap-3"
    >
      <LabelInput
        label={label}
        name={name}
        type={type}
        ref={ref || labelInputRef}
        focus={focus}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cn(className, "w-full")}
        inputClassName={inputClassName}
        error={error || validError}
        onKeyUp={(e) => {
          e.stopPropagation();
          keyUpHandler(e);
        }}
        {...props}
      />
      {isDirty && (
        <div className="flex items-end gap-2">
          <Button type="reset" variant={"outline"}>
            <UndoDotIcon />
          </Button>
          <Button type="submit" variant={"primary"} disabled={isPending}>
            <CheckLineIcon />
          </Button>
        </div>
      )}
    </form>
  );
}
