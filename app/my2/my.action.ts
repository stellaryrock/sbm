"use server";

import { auth } from "@/lib/auth";
import prisma, { findMemberByEmail } from "@/lib/db";
import { newToken } from "@/lib/utils";
import { validate, type ValidError } from "@/lib/validator";
import { compareSync } from "bcryptjs";
import { redirect } from "next/navigation";
import z from "zod";
import { sendmailByFetch } from "../sign/sign.action";

const getUserFromAuth = async () => {
  const session = await auth();
  if (!session?.user.email || !session.user.name) redirect("/sign");
  const { email, name: nickname } = session.user;

  return { email, nickname };
};

export const changePassword = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const { email, nickname } = await getUserFromAuth();

  const zobj = z
    .object({
      curr_passwd: z.string().min(6, "6자 이상 입력해주세요."),
      new_passwd: z.string().min(6, "6자 이상 입력해주세요."),
      new_passwd2: z.string().min(6, "6자 이상 입력해주세요."),
    })
    .refine(({ new_passwd, new_passwd2 }) => new_passwd === new_passwd2, {
      path: ["new_passwd2"],
      message: "비밀번호가 일치하지 않습니다.",
    });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { curr_passwd: passwd, new_passwd } = data;

  const mbr = await findMemberByEmail(email, true);
  // SNS-LOGIN
  if (!mbr?.passwd) redirect(`/sign?email${email}`);

  const passwdMatched = compareSync(passwd, mbr?.passwd ?? "");
  console.log("🚀 ~ changePassword ~ passwdMatched:", passwdMatched);
  if (!passwdMatched)
    return {
      curr_passwd: { errors: ["Check your password!"], value: "" },
    } as ValidError;

  const emailType = "reset-password";
  const emailcheck = newToken();
  await prisma.member.update({
    where: { email },
    data: { passwd: new_passwd, emailType, emailcheck },
  });

  const rs = await sendmailByFetch({
    email,
    emailcheck,
    nickname,
    emailType,
  });

  if (!rs.ok) return { newPasswd: { errors: ["Fail to send email!"] } };

  redirect(
    `/sign/error?error='CheckEmail'&email=${email}&emailcheck=${emailcheck}&emailType=${emailType}`,
  );
};

export const changeNickname = async (
  formData: FormData,
): Promise<[ValidError] | [null, string]> => {
  const { email, nickname: oldNickname } = await getUserFromAuth();

  const zobj = z.object({
    nickname: z.string().min(3, "3자 이상 입력해주세요."),
  });

  const [err, data] = validate(zobj, formData);

  if (err) return [err];

  const { nickname } = data;

  const mbr = await findMemberByEmail(email);
  if (!mbr || mbr.nickname !== oldNickname) redirect("/sign");

  const updated = await prisma.member.update({
    where: { email },
    data: { nickname },
  });

  console.log("🚀 ~ changeNickname ~ updated:", updated);

  return [null, nickname];
};

export const changeEmail = async (
  formData: FormData,
): Promise<[ValidError] | [null, string]> => {
  const { email: oldEmail, nickname } = await getUserFromAuth();

  const zobj = z.object({
    email: z.email(),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return [err];

  const { email } = data;
  const mbr = await findMemberByEmail(oldEmail);
  if (!mbr) throw new Error("Invalid Account");

  const emailcheck = newToken();
  const emailType = "regist";
  await prisma.member.update({
    where: { email: oldEmail },
    data: { email, emailcheck, emailType },
  });

  const rs = await sendmailByFetch({
    email,
    emailcheck,
    nickname,
    emailType,
  });

  if (!rs.ok) {
    const err = { email: { errors: ["Fail to send email!"], value: oldEmail } };
    return [err];
  }

  redirect(
    `/sign/error?error=CheckEmail&email=${email}&emailcheck=${emailcheck}&emailType=${emailType}`,
  );
};
