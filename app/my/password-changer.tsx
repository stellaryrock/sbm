import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { CheckLineIcon } from "lucide-react";
import { useActionState } from "react";
import { changePasswd } from "../sign/sign.action";

export default function PasswordChanger() {
  const [validError, makeChangePassword, isPending] = useActionState(
    changePasswd,
    undefined,
  );

  return (
    <form action={makeChangePassword} className="flex flex-col gap-3">
      <LabelInput
        label="Current Password"
        name="curr_passwd"
        type="password"
        error={validError}
        placeholder="current password..."
      />
      <LabelInput
        label="New Password"
        name="passwd"
        type="password"
        error={validError}
        placeholder="new password..."
      />
      <LabelInput
        label="New Password Confirm"
        name="passwd2"
        type="password"
        error={validError}
        placeholder="new password confirm..."
      />

      <Button type="submit" disabled={isPending} variant={"destructive"}>
        <CheckLineIcon /> 비밀번호 변경
      </Button>
    </form>
  );
}
