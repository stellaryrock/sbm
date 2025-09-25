/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect dep-arr */
"use client";

import {
  type ChangeEvent,
  type ComponentProps,
  type RefObject,
  useEffect,
  useId,
  useRef,
} from "react";
import { cn } from "../lib/utils";
import type { ValidError } from "../lib/validator";
import { Input } from "./ui/input";

type Props = {
  label: string;
  name?: string;
  ref?: RefObject<HTMLInputElement | null>;
  focus?: boolean;
  error?: ValidError;
  inputClassName?: string;
  setDiff?: (hasDiff: boolean) => void;
};

export default function LabelInput({
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
  setDiff,
  ...props
}: Props & ComponentProps<"input">) {
  const uniqName = useId();
  const inpRef = useRef<HTMLInputElement>(null);
  const err = !!error && !!name && error[name] ? error[name].errors : [];
  const val =
    !!error && !!name && error[name] ? error[name].value?.toString() : "";

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!setDiff) return;

    const { value, defaultValue } = e.target;
    setDiff(value !== defaultValue);
  };

  useEffect(() => {
    if (!focus && !err.length) return;

    const keys = Object.keys(error ?? {});
    if (!focus && (!err.length || keys[0] !== name)) return;

    if (ref) ref.current?.focus();
    else inpRef.current?.focus();
  }, [err]);

  return (
    <div className={cn(className)}>
      <label htmlFor={uniqName} className="font-semibold text-sm capitalize">
        {label}
        <Input
          type={type || "text"}
          id={uniqName}
          name={name || uniqName}
          ref={ref || inpRef}
          defaultValue={val || defaultValue || ""}
          placeholder={placeholder || ""}
          className={cn(
            "bg-gray-100 font-normal focus:bg-white",
            inputClassName,
          )}
          onChange={inputChangeHandler}
          {...props}
        />
        {err.map((e) => (
          <small key={e} className="ml-1 text-red-400">
            {e}
          </small>
        ))}
      </label>
    </div>
  );
}
