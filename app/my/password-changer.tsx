import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { CheckLineIcon } from "lucide-react";

export default function PasswordChanger() {
  return (
    <form>
      <div className="flex items-end gap-3">
        <LabelInput
          label="Current Password"
          name="curr_passwd"
          type="password"
          placeholder="current password..."
        />

        <Button type="button" variant={"destructive"}>
          <CheckLineIcon /> 비밀번호 변경
        </Button>
      </div>

      <LabelInput
        label="New Password"
        name="passwd"
        type="password"
        placeholder="new password..."
      />
      <LabelInput
        label="New Password Confirm"
        name="passwd2"
        type="password"
        placeholder="new password confirm..."
      />
    </form>
  );
}
