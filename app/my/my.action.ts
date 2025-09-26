"use server";

import { auth } from "@/lib/auth";
import prisma, { findMemberByEmail } from "@/lib/db";
import { comparePassword } from "@/lib/utils";
import { validate, type ValidError } from "@/lib/validator";
import { redirect } from "next/navigation";
import z from "zod";

export const validateProfile = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const ent = Object.fromEntries(formData.entries());
  console.log("🚀 ~ validateProfile ~ ent:", ent);

  const zbase = z.object({
    email: z.email(),
    nickname: z.string().min(3, "3자 이상 입력해주세요."),
  });

  const diffPassword = formData.get("diffPassword") === "true";
  const diffEmail = formData.get("diffEmail") === "true";
  const diffNickname = formData.get("diffNickname") === "true";

  const zobj = diffPassword
    ? zbase
        .extend({
          curr_passwd: z.string().min(6, "6자 이상 입력해주세요."),
          new_passwd: z.string().min(6, "6자 이상 입력해주세요."),
          new_passwd2: z.string().min(6, "6자 이상 입력해주세요."),
        })
        .refine(({ new_passwd, new_passwd2 }) => new_passwd === new_passwd2, {
          path: ["new_passwd2"],
          message: "비밀번호가 일치하지 않습니다.",
        })
    : zbase;

  const [err, data] = validate(zobj, formData);

  if (err) return err;

  const { email: new_email, nickname: new_nickname } = data;

  const session = await auth();
  if (!session?.user.email) redirect("/sign");

  const { email, name: nickname } = session.user;

  if (diffEmail && email === new_email) redirect("/sign");
  if (diffNickname && nickname === new_nickname) redirect("/sign");

  const mbr = await findMemberByEmail(session.user.email, diffPassword);

  let pwMatched: boolean = false;
  let passwd: string | undefined = "";
  let new_passwd: string | undefined = "";

  if (diffPassword) {
    if (!mbr?.passwd)
      return {
        curr_passwd: { errors: ["SNS 계정으로 가입된 회원입니다."], value: "" },
        new_passwd: { errors: [], value: "" },
        new_passwd2: { errors: [], value: "" },
      };

    passwd = formData.get("passwd")?.toString();
    new_passwd = formData.get("new_passwd")?.toString();

    pwMatched = await comparePassword(passwd, mbr.passwd);

    if (!pwMatched)
      return { curr_passwd: { errors: ["비밀번호를 확인하세요!"], value: "" } };
  }

  const chk = await findMemberByEmail(new_email);
  if (chk)
    return {
      email: { errors: ["이미 가입된 이메일입니다."], value: new_email },
    };

  await prisma.member.update({
    where: { email },
    data: {
      email: diffEmail ? new_email : undefined,
      nickname: diffNickname ? new_nickname : undefined,
      passwd: diffPassword && pwMatched ? new_passwd : undefined,
    },
  });

  return undefined;
};
