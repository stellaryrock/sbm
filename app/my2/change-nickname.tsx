"use client";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import { useRef, useState, useTransition } from "react";
import { changeNickname } from "./my.action";

export default function ChangeNickname({
  defaultValue,
  email,
}: {
  defaultValue: string;
  email: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<ValidError>({
    nickname: { errors: [], value: defaultValue },
  });
  const [diffNickname, setDiffNickname] = useState(false);
  const [isPending, startTransition] = useTransition();

  const clickHandler = () => {
    console.log("click");
    startTransition(async () => {
      console.log(">>>");
      if (!inputRef.current?.value || !diffNickname) return;
      console.log("!!!");
      const formData = new FormData();
      formData.set("email", email);
      formData.set("nickname", inputRef.current.value);
      const [err, data] = await changeNickname(formData);
      console.log(err, data);
      if (err) setError(err);

      inputRef.current.defaultValue = data ?? "";
    });
  };
  return (
    <div className={cn({ "flex items-end gap-3": diffNickname })}>
      <LabelInput
        label={"nickname"}
        name="nickname"
        error={error}
        defaultValue={defaultValue || ""}
        ref={inputRef}
        setDiff={setDiffNickname}
        className="flex-1"
      />
      {diffNickname && (
        <Button onClick={clickHandler} disabled={isPending} variant={"success"}>
          Change Nickname
        </Button>
      )}
    </div>
  );
}
