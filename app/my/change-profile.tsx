"use client";

import LabelEditor from "@/components/label-editor";
import { Button } from "@/components/ui/button";
import { CheckLineIcon, UndoDotIcon } from "lucide-react";
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

      <PasswordChanger />

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
