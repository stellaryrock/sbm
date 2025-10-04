"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import prisma, { findMemberByEmail } from "@/lib/db";
import { newToken, uniqId, uniqNumId } from "@/lib/utils";
import {
  comparePassword,
  existsEmail,
  validate,
  type ValidError,
} from "@/lib/validator";
import { hash } from "bcryptjs";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import z from "zod";
import type { SendMailBody } from "../api/sendmail/route";

export type Provider = "google" | "github" | "naver" | "kakao";

export const login = async (provider: Provider, callback?: string | null) => {
  await signIn(provider, { redirectTo: callback || "/bookcase" });
};

export const loginNaver = async (redirectTo?: string | null) =>
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
    console.log("🚀 ~ redirectTo:", redirectTo);
    // await signIn('credentials', formData);
    await signIn("credentials", { ...data, redirectTo });
  } catch (error) {
    console.log("🚀 sign.action.authorize - error:", error);
    if (error instanceof AuthError) {
      let typeErr: string;
      switch (error.type) {
        case "AccessDenied":
        case "EmailSignInError":
          typeErr = error.message.split("Read more")[0];
          break;
        case "OAuthAccountNotLinked":
          typeErr = `Already registed SNS Account`;
          break;
        case "CredentialsSignin":
          typeErr =
            error.message.split("Read more")[0] ||
            "Not match Email or Password!";
          break;
        default:
          typeErr = error.message || "Something went wrong!";
      }

      return {
        email: { errors: [typeErr], value: data.email },
        passwd: { errors: [], value: data.passwd },
      } as ValidError;
    }
    throw error;
  }
};

export const logout = async () => {
  await signOut({ redirectTo: "/sign" }); // QQQ: '/'
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
      message: "Passwords are not matched!",
    });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, nickname, passwd: orgPasswd } = data;

  const existErr = existsEmail(email);
  if (existErr) return existErr;

  const mbr = await findMemberByEmail(email);
  if (mbr)
    return {
      email: { errors: ["Duplicated Email Address!"], value: email },
    };

  const passwd = await hash(orgPasswd, 10);
  const emailcheck = newToken();
  const emailType = "regist";

  await prisma.member.create({
    data: { email, nickname, passwd, emailcheck, emailType },
  });

  const rs = await sendmailByFetch({ email, emailcheck, emailType });

  if (!rs.ok) return { email: { errors: ["Fail to send email!"] } };

  redirect(
    `/sign/error?error=CheckEmail&email=${email}&emailcheck=${emailcheck}&emailType=${emailType}`,
  );
};

export const sendResetPassword = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z.object({
    email: z.email(),
  });
  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const emailcheck = newToken();
  const emailType = "reset-password";
  const { email } = data;
  const { nickname } = await prisma.member.update({
    select: { nickname: true },
    where: { email },
    data: { emailcheck, emailType },
  });

  const rs = await sendmailByFetch({
    email,
    emailcheck,
    nickname,
    emailType,
  });

  if (!rs.ok) return { email: { errors: ["Fail to send email!"] } };

  redirect(
    `/sign/error?error=CheckEmail&email=${email}&emailcheck=${emailcheck}&emailType=${emailType}`,
  );
};

export const resetPassword = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z
    .object({
      email: z.email(),
      emailcheck: z.uuidv4(),
      passwd: z.string().min(6),
      passwd2: z.string().min(6),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      path: ["passwd2"],
      message: "Not Match Passoword and Password confirm!",
    });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, passwd2, emailcheck } = data;
  const passwd = await hash(passwd2, 10);
  await prisma.member.update({
    where: { email, emailcheck },
    data: { passwd, emailcheck: null, emailType: null },
  });

  redirect(`/sign/error?error=Your password changed.`);
};

export const resendRegist = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z.object({
    email: z.email(),
    emailcheck: z.uuidv4(),
    emailType: z.enum(["regist", "reset-password"]).optional(),
  });
  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, emailcheck, emailType } = data;
  const mbr = await findMemberByEmail(email);
  if (!mbr || mbr.emailcheck !== emailcheck) {
    redirect("/sign/error?error=EmailSendFail");
  }

  const newEmailCheck = newToken();
  await prisma.member.update({
    where: { email },
    data: { emailcheck: newEmailCheck },
  });

  const rs = await sendmailByFetch({
    email,
    emailcheck: newEmailCheck,
    emailType,
    nickname: mbr.nickname,
  });
  if (!rs.ok) return { email: { errors: ["Fail to send email!"] } };

  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

export const sendmailByFetch = async ({
  email,
  emailcheck,
  nickname,
  emailType = "regist",
}: SendMailBody) => {
  const { NEXT_PUBLIC_URL, INTERNAL_SECRET } = process.env;

  return fetch(`${NEXT_PUBLIC_URL}/api/sendmail`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${INTERNAL_SECRET}`,
    },
    body: JSON.stringify({ email, emailcheck, nickname, emailType }),
  });
};

export type UpdateProfileImageReturn = ReturnType<typeof updateProfileImage>;
export const updateProfileImage = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session?.user.email) throw new Error("Need Login!");
  const { id, email } = session.user;

  const ent = Object.fromEntries(formData.entries());
  console.log("🚀 ~ updateProfileImage ~ ent:", ent);

  const zobj = z.object({
    image: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, "Under 10MB!")
      .refine((file) => file.type.startsWith("image/"), "Upload Image only!"),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return [err];

  const uploadDir = path.join(`${process.cwd()}`, "public", "profiles");
  if (existsSync(uploadDir)) path.join(process.cwd(), "public", "profiles");

  const fileName = `${id}_${uniqId()}_${data.image.name}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await data.image.arrayBuffer());
  await writeFile(filePath, buffer);
  const image = `profiles/${fileName}`;

  const mbr = await prisma.member.update({
    where: { email },
    data: { image },
  });

  revalidatePath("/profiles");

  return [null, mbr];
};

export const sendEmailChangeCode = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.email) throw new Error("Need Login!");

  const { email } = session.user;

  const zobj = z.object({
    newEmail: z.email(),
  });

  const [err, data] = validate(zobj, formData);

  if (err) return err;

  const { newEmail } = data;

  const existsErr = await existsEmail(newEmail, "newEmail");
  if (existsErr) return existsErr;

  const emailcheck = uniqNumId();
  await prisma.member.update({
    where: { email },
    data: { emailcheck },
  });

  /*
  Error [PrismaClientKnownRequestError]:
  Invalid `prisma.member.update()` invocation:
  */
  setTimeout(
    async () => {
      await prisma.member.update({
        where: { email },
        data: { emailcheck: null },
      });
    },
    2 * 60 * 1000,
  );

  await sendmailByFetch({
    email,
    emailcheck,
    emailType: "email-change-code",
  });
};

export type UpdateMemberReturn = ReturnType<typeof updateNickname>;
export const updateNickname = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.email) throw new Error("Need Login");
  const zobj = z.object({ nickname: z.string().min(3) });

  const { email } = session.user;

  const [err, data] = validate(zobj, formData);
  if (err) return [err, null] as const;

  const { nickname } = data;
  const mbr = await prisma.member.update({
    where: { email },
    data: { nickname },
  });

  return [err, mbr] as const;
};

export const updateEmail = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.email) throw new Error("Need Login!");

  const { email } = session.user;
  const mbr = await findMemberByEmail(email);
  if (!mbr || !mbr.emailcheck || mbr.emailcheck.length !== 5) {
    return [
      {
        emailChangeCode: { errors: ["Invalid Code!"] },
      } as ValidError,
      null,
    ] as const;
  }

  const zobj = z.object({
    newEmail: z.email(),
    emailChangeCode: z.literal(mbr.emailcheck, "Invalid Code!"),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return [err, null] as const;

  const { newEmail } = data;
  const existsErr = await existsEmail(newEmail);
  if (existsErr) return [existsErr, null] as const;

  const newMbr = await prisma.member.update({
    where: { email },
    data: { email: newEmail, emailcheck: null },
  });

  return [null, newMbr] as const;
};

export const sendResetPasswordMail = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const session = await auth();
  if (!session || !session.user || !session.user.email)
    return signOut({ redirectTo: "/sign" });

  const { email } = session.user;

  const zobj = z.object({
    curr_passwd: z.string().min(6, "6자 이상 입력해주세요."),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { curr_passwd: passwd } = data;
  const mbr = await findMemberByEmail(email, true);
  if (!mbr) return signOut({ redirectTo: "/sign" });
  if (!mbr.passwd)
    return { curr_passwd: { errors: ["sns 계정으로 가입된 회원입니다."] } };

  const pwMatched = await comparePassword(passwd, mbr.passwd);
  if (!pwMatched)
    return { curr_passwd: { errors: ["비밀번호를 확인하세요."] } };

  const emailcheck = newToken();
  const emailType = "reset-password";
  const { nickname } = await prisma.member.update({
    select: { nickname: true },
    where: { email },
    data: { emailcheck, emailType },
  });

  const rs = await sendmailByFetch({
    email,
    emailcheck,
    nickname,
    emailType,
  });

  if (!rs.ok) return { curr_passwd: { errors: ["Fail to send email!"] } };

  return signOut({
    redirectTo: `/sign/error?error=CheckEmail&email=${email}&emailcheck=${emailcheck}&emailType=${emailType}`,
  });
};

export const changePasswd = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const session = await auth();
  if (!session?.user || !session?.user.email || !session?.user.name)
    redirect(`/sign`);

  const { email } = session.user;

  const zobj = z
    .object({
      curr_passwd: z.string().min(6, "6자 이상 입력하세요."),
      passwd: z.string().min(6, "6자 이상 입력하세요"),
      passwd2: z.string().min(6, "6자 이상 입력하세요."),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      path: ["passwd2"],
      message: "비밀번호가 일치하지 않습니다.",
    });

  const [err, data] = validate(zobj, formData);

  if (err) return err;

  const { curr_passwd: orgPasswd, passwd } = data;

  const mbr = await findMemberByEmail(session.user.email, true);
  if (!mbr) redirect(`/sign`);
  if (!mbr.passwd)
    return { curr_passwd: { errors: ["SNS 계정으로 가입된 회원입니다."] } };

  const pwMatched = comparePassword(orgPasswd, passwd);
  if (!pwMatched)
    return { curr_passwd: { errors: ["비밀번호를 확인하세요."] } };

  const newPasswd = await hash(passwd, 10);

  // success
  await prisma.member.update({
    where: { email },
    data: { passwd: newPasswd },
  });

  return signOut({ redirectTo: `/sign?email=${email}` });
};
