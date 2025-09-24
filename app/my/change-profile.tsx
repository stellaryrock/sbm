"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { CheckIcon, UndoIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ChangeProfile() {
  const { data: session } = useSession({ required: true });
  const [diffEmail, setDiffEmail] = useState(false);

  return (
    <form action="" className="space-y-3 text-left">
      <LabelInput
        label={"nickname"}
        name="nickname"
        focus={true}
        defaultValue={session?.user?.name || ""}
      />
      <div className="flex items-end gap-2">
        <LabelInput
          label={"email"}
          name="email"
          focus={true}
          defaultValue={session?.user?.email || ""}
          onChange={(e) => setDiffEmail(e.target.value !== session?.user.email)}
          className="w-full"
        />
        {diffEmail && <Button variant={"outline"}>Send Verify Code</Button>}
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
      />
      <LabelInput
        label="New Password Confirm"
        name="new_passwd2"
        type="password"
        placeholder="New Password Confirm"
      />
      <div className="flex">
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
