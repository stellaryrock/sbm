"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ChangePassword() {
  const [diffPassword, setDiffPassword] = useState(false);

  return (
    <div>
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
    </div>
  );
}
