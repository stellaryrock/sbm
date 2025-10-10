"use client";

import LabelEditor from "@/components/label-editor";
import { Button } from "@/components/ui/button";
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
  const { update, data } = useSession({ required: true });
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

      {isEditingEmail ? (
        <EmailChanger
          toggleEditing={toggleEditingEmail}
          email={data?.user.email}
        />
      ) : (
        <Button
          onClick={toggleEditingEmail}
          variant={"success"}
          className="mt-3"
        >
          Change {data?.user.email}
        </Button>
      )}
      {/* <LabelEditor
        saveAction={changePassword}
        label={"password"}
        submitLabel="Send Verify Email"
        name="curr_passwd"
        type="password"
      /> */}
      {isEditingPassword ? (
        <PasswordChanger toggleEditing={toggleEditingPassword} />
      ) : (
        <Button
          onClick={toggleEditingPassword}
          variant={"destructive"}
          className="mt-3"
        >
          Change Password
        </Button>
      )}
    </div>
  );
}
