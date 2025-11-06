import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ValidError } from "@/lib/validator";
import type { ComponentProps } from "react";

type LabelTextareaProps = {
  label: string;
  name?: string;
  defaultValue?: string;
  error?: ValidError;
};

export default function LabelTextarea({
  label,
  name,
  defaultValue,
  error,
  ...props
}: LabelTextareaProps & ComponentProps<typeof Textarea>) {
  const { errors, value } =
    !!error && !!name && !!error[name] ? error[name] : { errors: [] };

  return (
    <div className="flex flex-col gap-3">
      <Label className="font-semibold text-sm capitalize" htmlFor="descript">
        {label}
      </Label>
      <Textarea name={name} defaultValue={value?.toString() || defaultValue} {...props} />
      {errors.map((err) => (
        <small key={err} className="ml-1 text-red-400">
          {err}
        </small>
      ))}
    </div>
  );
}
