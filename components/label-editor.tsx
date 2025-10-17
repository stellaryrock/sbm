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
} from "react";
import LabelInput, { type LabelInputProps } from "./label-input";
import { Button } from "./ui/button";

type Props = {
  saveAction: (formData: FormData) => Promise<ValidError | undefined>;
  resetOption?: {
    keepError?: boolean;
  };
  resetLabel?: string;
  submitLabel?: string;
};

export default function LabelEditor({
  saveAction,
  label,
  resetOption = { keepError: false },
  resetLabel,
  submitLabel,
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
  const [internalDefault, setInternalDefault] = useState(defaultValue);
  const [validError, setValidError] = useState<ValidError>();
  const labelInputRef = useRef<HTMLInputElement>(null);

  const chkDirty = () => {
    const labelInput = labelInputRef.current;
    if (!labelInput) return;

    const chk = labelInput.value !== internalDefault;

    if (chk !== isDirty) setDirty(chk);
  };

  const [isPending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    if (e.type !== "submit") return;

    e.preventDefault();
    setValidError(undefined);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const err = await saveAction(formData);
      if (err) setValidError(err);
      else {
        setInternalDefault(labelInputRef.current?.value);
        setDirty(false);
      }
    });
  };

  const resetHandler = (e: FormEvent<HTMLFormElement>) => {
    if (e.type !== "reset") return;
    e.preventDefault();

    setDirty(false);
    if (!resetOption?.keepError) setValidError(undefined);

    if (labelInputRef.current && internalDefault)
      labelInputRef.current.value = internalDefault.toString();
  };

  return (
    <form
      onSubmit={submitHandler}
      onResetCapture={resetHandler}
      className={cn("flex flex-nowrap gap-3", {
        "items-center": Boolean(validError),
      })}
    >
      <LabelInput
        label={label}
        name={name}
        type={type}
        ref={ref || labelInputRef}
        focus={focus}
        defaultValue={internalDefault}
        placeholder={placeholder}
        className={cn(className, "w-full")}
        inputClassName={inputClassName}
        error={error || validError}
        onKeyDown={(e) => {
          e.stopPropagation();
          chkDirty();
        }}
        {...props}
      />
      {isDirty && (
        <div className="flex items-end gap-2">
          <Button type="reset" variant={"outline"}>
            <UndoDotIcon /> {resetLabel}
          </Button>
          <Button type="submit" variant={"primary"} disabled={isPending}>
            <CheckLineIcon /> {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}
