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
  resetLabel?: string;
  submitLabel?: string;
};

export default function LabelEditor({
  saveAction,
  label,
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
  const [validError, setValidError] = useState<ValidError>();
  const labelInputRef = useRef<HTMLInputElement>(null);

  const chkDirty = () => {
    const chk =
      labelInputRef.current?.defaultValue !== labelInputRef.current?.value;
    if (chk !== isDirty) setDirty(chk);
  };
  //const debouncedChkDirty = useDebounce(chkDirty, 500);

  // const keyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
  //   debouncedChkDirty();
  // };

  const [isPending, startTransition] = useTransition();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidError(undefined);

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
