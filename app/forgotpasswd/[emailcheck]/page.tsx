import { findMemberByEmailcheck } from "@/app/sign/sign.action";
import { redirect } from "next/navigation";
import ResetPasswd from "./reset-passwd";

export default async function ResetForgotPasswd({
  params,
}: {
  params: Promise<{ emailcheck: string }>;
}) {
  const { emailcheck } = await params;

  const mbr = await findMemberByEmailcheck(emailcheck);

  if (!mbr) redirect("/sign/error?error=InvalidAccount");

  const { email, nickname, emailcheck: emailcheckFromDb } = mbr;

  if (emailcheck !== emailcheckFromDb)
    redirect("/sign/error?error=InvalidEmailCheck");

  return (
    <div className="grid h-full place-items-center">
      <div className="w-96">
        <h1 className="mb-3 font-semibold text-2xl">Change Password</h1>
        <div className="text-gray-500 text-sm">Hello, {nickname}</div>
        <div className="mb-5 text-gray-500 text-sm">Reset your password</div>
        <ResetPasswd email={email} emailcheck={emailcheck} />
      </div>
    </div>
  );
}
