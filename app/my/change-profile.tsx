"use client";

import LabelEditor from "@/components/label-editor";
import { Button } from "@/components/ui/button";
import { CheckLineIcon, UndoDotIcon } from "lucide-react";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useReducer } from "react";
import { sendPasswordResetMail, updateNickname } from "../sign/sign.action";
import EmailChanger from "./email-changer";

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

  const changePassword = async (formData: FormData) => {
    const err = await sendPasswordResetMail(formData);
    if (err) return err;
  };

  return (
    <div className="space-y-3 text-left">
      <LabelEditor
        label="nickname"
        name="nickname"
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
      {/* <PasswordChanger /> */}
      <LabelEditor
        label={"password"}
        submitLabel="Send Verify Email"
        name="curr_passwd"
        type="password"
        saveAction={changePassword}
      />

      <div className="flex justify-center gap-5">
        <Button type="reset" variant={"outline"}>
          <UndoDotIcon /> Cancel
        </Button>
        <Button type="submit" variant={"primary"}>
          <CheckLineIcon /> Save
        </Button>
      </div>
    </div>
  );
}
