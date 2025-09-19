import { sendPasswordReset, sendRegistCheck } from "@/app/sign/mail.action";
import { NextResponse, type NextRequest } from "next/server";

export type SendMailBody = {
  email: string;
  emailcheck: string;
  nickname?: string;
  emailType?: "regist" | "reset-password";
};

export async function POST(req: NextRequest) {
  const {
    email,
    emailcheck,
    nickname,
    emailType = "regist",
  }: SendMailBody = await req.json();
  console.log(">>> sendmail ", email, emailcheck, nickname, emailType);
  const authorization = req.headers.get("authorization");
  if (authorization !== `Bearer ${process.env.INTERNAL_SECRET}`)
    throw new Error("InvalidToken");

  const rs =
    emailType === "regist"
      ? await sendRegistCheck(email, emailcheck)
      : await sendPasswordReset(email, emailcheck, nickname);

  return NextResponse.json(rs);
}
