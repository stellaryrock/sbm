"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { CheckIcon, UndoIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useActionState, useRef, useState } from "react";
import { validateProfile } from "./my.action";

export default function ChangeProfile() {
  const { data: session } = useSession({ required: true });
  const [diffEmail, setDiffEmail] = useState(false);
  const [diffNickname, setDiffNickname] = useState(false);
  const [diffPassword, setDiffPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [validError, validateProfileAction, isPending] = useActionState(
    validateProfile,
    undefined,
  );

  if (!session?.user.email || !session.user.name) redirect("/sign");
  const { email, name } = session.user;

  const makeChangeProfile = (formData: FormData) => {
    console.log(diffEmail, diffNickname, diffPassword);
    if (!(diffEmail || diffNickname || diffPassword)) return;

    formData.set("diffEmail", diffEmail.toString());
    formData.set("diffNickname", diffNickname.toString());
    formData.set("diffPassword", diffPassword.toString());

    validateProfileAction(formData);

    formRef.current?.reset();
  };

  const resetHandler = () => {
    setDiffEmail(false);
    setDiffNickname(false);
    setDiffPassword(false);
  };

  return (
    <form
      action={makeChangeProfile}
      onReset={resetHandler}
      ref={formRef}
      className="space-y-3 text-left"
    >
      <div>
        <LabelInput
          label={"nickname"}
          name="nickname"
          defaultValue={name}
          error={validError}
          setDiff={setDiffNickname}
          className="flex-1"
        />
      </div>
      <div>
        <LabelInput
          label={"email"}
          name="email"
          error={validError}
          defaultValue={email}
          setDiff={setDiffEmail}
          className="flex-1"
        />
        {diffEmail && <Button variant={"success"}>Send Verify Code</Button>}
      </div>
      <div>
        <LabelInput
          label="Current Password"
          name="curr_passwd"
          error={validError}
          type="password"
          placeholder="Current Password"
        />
        <LabelInput
          label="New Password"
          name="new_passwd"
          error={validError}
          type="password"
          placeholder="New Password"
          setDiff={setDiffPassword}
        />
        <LabelInput
          label="New Password Confirm"
          name="new_passwd2"
          error={validError}
          type="password"
          placeholder="New Password Confirm"
          setDiff={setDiffPassword}
        />
      </div>
      <div className="flex gap-3">
        <Button type="reset" variant={"outline"}>
          <UndoIcon />
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} variant={"primary"}>
          <CheckIcon />
          Save
        </Button>
      </div>
    </form>
  );
}
