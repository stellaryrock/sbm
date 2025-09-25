"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { newToken } from "@/lib/utils";
import { validate, type ValidError } from "@/lib/validator";
import { compareSync } from "bcryptjs";
import { redirect } from "next/navigation";
import z from "zod";
import { findMemberByEmail, sendmailByFetch } from "../sign/sign.action";

export const changePassword = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const session = await auth();
  if (!session?.user.email) redirect("/sign");

  const { email } = session.user;

  const zobj = z.object({
    curr_passwd: z.string().min(6, "6자 이상 입력해주세요."),
    new_passwd: z.string().min(6, "6자 이상 입력해주세요."),
    new_passwd2: z.string().min(6, "6자 이상 입력해주세요."),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { curr_passwd: passwd, new_passwd } = data;

  const mbr = await findMemberByEmail(email, true);
  // SNS-LOGIN
  if (!mbr?.passwd) redirect(`/sign?email${email}`);

  const passwdMatched = compareSync(passwd, mbr?.passwd ?? "");
  if (!passwdMatched) return { passwd: { errors: ["Check your password!"] } };

  const emailType = "reset-password";
  const emailcheck = newToken();
  const { nickname } = await prisma.member.update({
    select: { nickname: true },
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
  _: ValidError | undefined,
  formData: FormData,
) => {};

export const changeEmail = async (
  _: ValidError | undefined,
  formData: FormData,
) => {};
