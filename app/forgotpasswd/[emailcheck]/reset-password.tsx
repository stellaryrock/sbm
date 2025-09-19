"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import type { ValidError } from "@/lib/validator";
import { useActionState } from "react";
type Props = {
  action: (
    _: ValidError | undefined,
    formData: FormData,
  ) => Promise<ValidError | undefined>;
};

export default function ResetPasswordForm({ action }: Props) {
  const [validError, makeAction, isPending] = useActionState(action, undefined);
  return (
    <form action={makeAction}>
      <LabelInput
        label="new password"
        name="passwd"
        type="password"
        error={validError}
        focus={true}
        placeholder="new password..."
      />
      <LabelInput
        label="new password confirm"
        name="passwd2"
        error={validError}
        type="password"
        placeholder="new password confirm..."
        className="mt-5"
      />

      <Button
        type="submit"
        disabled={isPending}
        variant={"destructive"}
        className="my-5 w-full"
      >
        Change Password
      </Button>
    </form>
  );
}
