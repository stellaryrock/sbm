"use client";

import LabelEditor from "@/components/label-editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useReducer } from "react";
import { updateNickname } from "../sign/sign.action";
import EmailChanger from "./email-changer";
import PasswordChanger from "./password-changer";

type Props = {
  user: {
    isadmin?: boolean | undefined;
  } & User;
};
export default function ChangeProfile({ user }: Props) {
  // const { update } = useSession({ required: true });
  const { update } = useSession();
  const [isEditingEmail, toggleEditingEmail] = useReducer((pre) => !pre, false);
  const [isEditingPassword, toggleEditingPassword] = useReducer(
    (pre) => !pre,
    false,
  );

  const changeNickname = async (formData: FormData) => {
    const [err, mbr] = await updateNickname(formData);
    if (err) return err;

    await update(mbr);
  };

  return (
    <div className="space-y-3 text-left">
      <LabelEditor
        label="nickname"
        name="nickname"
        resetOption={{ keepError: true }}
        defaultValue={user.name || ""}
        saveAction={changeNickname}
      />

      <div className={cn({ "w-[80%]": !isEditingEmail })}>
        {isEditingEmail ? (
          <EmailChanger toggleEditing={toggleEditingEmail} email={user.email} />
        ) : (
          <Button
            onClick={toggleEditingEmail}
            variant={"success"}
            className="mt-3"
          >
            <PencilIcon /> {user.email}
          </Button>
        )}
      </div>

      <div className={cn({ "w-[80%]": !isEditingPassword })}>
        {isEditingPassword ? (
          <PasswordChanger toggleEditing={toggleEditingPassword} />
        ) : (
          <Button
            onClick={toggleEditingPassword}
            variant={"destructive"}
            className="mt-3"
          >
            <PencilIcon /> Password
          </Button>
        )}
      </div>
    </div>
  );
}
