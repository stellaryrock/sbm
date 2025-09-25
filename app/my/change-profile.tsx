"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { CheckIcon, UndoIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ChangeProfile() {
  const { data: session } = useSession({ required: true });
  const [diffEmail, setDiffEmail] = useState(false);
  const [diffPassword, setDiffPassword] = useState(false);
  const [diffNickname, setDiffNickname] = useState(false);

  const resetHandler = () => {
    setDiffEmail(false);
    setDiffPassword(false);
    setDiffNickname(false);
  };

  return (
    <form onReset={resetHandler} className="space-y-3 text-left">
      <LabelInput
        label={"nickname"}
        name="nickname"
        focus={!diffEmail && !diffPassword && !diffNickname}
        defaultValue={session?.user?.name || ""}
        setDiff={setDiffNickname}
      />
      {diffNickname && <Button variant={"success"}>Change Nickname</Button>}
      <div className="flex items-end gap-2">
        <LabelInput
          label={"email"}
          name="email"
          defaultValue={session?.user?.email || ""}
          setDiff={setDiffEmail}
          className="w-full"
        />
        {diffEmail && <Button variant={"success"}>Send Verify Code</Button>}
      </div>

      <LabelInput
        label="Current Password"
        name="curr_passwd"
        type="password"
        placeholder="Current Password"
      />
      <LabelInput
        label="New Password"
        name="new_passwd"
        type="password"
        placeholder="New Password"
        setDiff={setDiffPassword}
      />
      <LabelInput
        label="New Password Confirm"
        name="new_passwd2"
        type="password"
        placeholder="New Password Confirm"
        setDiff={setDiffPassword}
      />
      {diffPassword && <Button variant={"success"}>Change Password</Button>}
      <div className="flex gap-3">
        <Button type="reset" variant={"outline"}>
          <UndoIcon />
          Cancel
        </Button>
        <Button type="submit" variant={"primary"}>
          <CheckIcon />
          Save
        </Button>
      </div>
    </form>
  );
}
