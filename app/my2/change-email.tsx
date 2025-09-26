"use client";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { useRef, useState, useTransition } from "react";
import { changeEmail } from "./my.action";

export default function ChangeEmail({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const [diffEmail, setDiffEmail] = useState(false);
  const [error, setError] = useState<ValidError>({
    email: { errors: [], value: defaultValue },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const clickHandler = () => {
    startTransition(async () => {
      if (!inputRef.current?.value || !diffEmail) return;

      const formData = new FormData();
      formData.set("email", inputRef.current.value);

      const [err, data] = await changeEmail(formData);
      if (err) setError(err);

      inputRef.current.value = data || defaultValue;
    });
  };

  return (
    <div className={cn({ "flex items-end gap-3": diffEmail })}>
      <LabelInput
        label={"email"}
        name="email"
        defaultValue={defaultValue}
        setDiff={setDiffEmail}
        error={error}
        ref={inputRef}
        className="flex-1"
      />
      {diffEmail && (
        <Button disabled={isPending} onClick={clickHandler} variant={"success"}>
          Send Verify Code
        </Button>
      )}
    </div>
  );
}
