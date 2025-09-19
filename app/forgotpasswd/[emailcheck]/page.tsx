import { findMemberByEmailcheck } from "@/app/sign/sign.action";
import prisma from "@/lib/db";
import { validate, type ValidError } from "@/lib/validator";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import z from "zod";
import ResetPasswordForm from "./reset-password";

export default async function ResetForgotPasswd({
  params,
}: {
  params: Promise<{ emailcheck: string }>;
}) {
  const { emailcheck } = await params;
  console.log("🚀 ResetForgotPasswd ~ emailcheck:", emailcheck);

  const mbr = await findMemberByEmailcheck(emailcheck);

  if (emailcheck !== mbr?.emailcheck)
    redirect("/sign/error?error=InvalidEmailCheck");

  async function resetPassword(_: ValidError | undefined, formData: FormData) {
    "use server";
    const zobj = z
      .object({
        passwd: z.string().min(6, "6자 이상 입력해주세요."),
        passwd2: z.string().min(6, "6자 이상 입력해주세요."),
      })
      .refine(({ passwd, passwd2 }) => passwd === passwd2, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwd2"],
      });

    const [err, data] = validate(zobj, formData);

    if (err) return err;

    const passwd = await hash(data.passwd, 10);
    await prisma.member.update({
      where: { email: mbr?.email },
      data: { passwd, emailcheck: null },
    });

    redirect(`/sign?email=${mbr?.email}`);
  }

  return (
    <div className="grid h-full place-items-center">
      <div className="w-96">
        <h1 className="mb-3 font-semibold text-2xl">Change Password</h1>
        <div className="text-gray-500 text-sm">Hello, {mbr?.nickname}</div>
        <div className="mb-5 text-gray-500 text-sm">Reset your password</div>
        <ResetPasswordForm action={resetPassword} />
      </div>
    </div>
  );
}
