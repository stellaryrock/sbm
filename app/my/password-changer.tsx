import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { CheckLineIcon, UndoDotIcon } from "lucide-react";
import { type ActionDispatch, useActionState } from "react";
import { sendResetPasswordMail } from "../sign/sign.action";
type Props = {
  toggleEditing: ActionDispatch<[]>;
};

export default function PasswordChanger({ toggleEditing }: Props) {
  const [validError, makeChangePassword, isSending] = useActionState(
    sendResetPasswordMail,
    undefined,
  );

  return (
    <form
      onResetCapture={toggleEditing}
      action={makeChangePassword}
      className="flex items-end gap-3"
    >
      <LabelInput
        label="Current Password"
        name="curr_passwd"
        type="password"
        error={validError}
        placeholder="current password..."
        className="flex-1"
      />

      <div className="mt-3 flex justify-center gap-5">
        <Button type="reset" variant={"outline"}>
          <UndoDotIcon /> Cancel
        </Button>
        <Button type="submit" disabled={isSending} variant={"primary"}>
          <CheckLineIcon /> Send Verify Code
        </Button>
      </div>
    </form>
  );
}
