"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import z from "zod";
import { signIn, signOut } from "../../lib/auth";
import prisma from "../../lib/db";
import { newToken } from "../../lib/utils";
import { type ValidError, validate } from "../../lib/validator";
import { sendRegistCheck } from "./mail.action";

export type Provider = "google" | "github" | "naver" | "kakao";

export const login = async (provider: Provider, callback?: string) => {
  await signIn(provider, { redirectTo: callback || "/bookcase" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/sign" }); // QQQ: '/'
};

export const loginNaver = async (redirectTo?: string) =>
  login("naver", redirectTo);

// credential login (email, passwd)
export const authorize = async (
  _preValidError: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z.object({
    email: z.email(),
    passwd: z.string().min(6, "More than 6 characters!"),
  });
  const [err, data] = validate(zobj, formData);
  if (err) return err;

  try {
    const redirectTo = formData.get("redirectTo")?.toString() || "/bookcase";

    await signIn("credentials", {
      ...data,
      redirectTo,
    });
  } catch (error) {
    console.log("🚀 ~ sign.action > authorize, error:", error);
    throw error;
  }
};

export const regist = async (
  _preValidError: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z
    .object({
      email: z.email(),
      passwd: z.string().min(6),
      passwd2: z.string().min(6),
      nickname: z.string().min(3),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      path: ["passwd2"],
      error: "Passwords are not matched!",
    });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, nickname, passwd: orgPasswd } = data;

  const mbr = await findMemberByEmail(email);
  if (mbr)
    return { email: { errors: ["Duplicated Email Address"], value: email } };

  const passwd = await hash(orgPasswd, 10);
  const emailcheck = newToken();

  const newMbr = await prisma.member.create({
    data: { email, passwd, nickname, emailcheck },
  });
  console.log("🚀 ~ regist ~ newMbr:", newMbr);

  await sendRegistCheck(email, emailcheck);
  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

export const findMemberByEmail = async (
  email: string,
  passwd: boolean = false,
) =>
  prisma.member.findUnique({
    select: {
      id: true,
      nickname: true,
      isadmin: true,
      emailcheck: true,
      outdt: true,
      passwd,
    },
    where: { email },
  });
