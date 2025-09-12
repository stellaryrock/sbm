import { type ComponentProps, type RefObject, useId } from "react";
import { cn } from "../lib/utils";
import { Input } from "./ui/input";

type Props = {
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  ref?: RefObject<HTMLInputElement>;
};

export default function LabelInput({
  label,
  type,
  name,
  placeholder,
  className,
  ref,
  ...props
}: Props & ComponentProps<"input">) {
  const uniqName = useId();
  return (
    <label htmlFor={uniqName} className="font-semibold text-sm capitalize">
      {label}
      <Input
        type={type || "text"}
        id={uniqName}
        name={name || uniqName}
        ref={ref}
        placeholder={placeholder}
        className={cn("bg-gray-100 font-normal focus:bg-white", className)}
        {...props}
      />
    </label>
  );
}
