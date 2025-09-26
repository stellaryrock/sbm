import { findMemberByEmail } from "@/lib/db";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

type Props = {
  params: Promise<{ emailcheck: string }>;
  searchParams: Promise<{ email: string }>;
};

export default async function RegistCheck({ params, searchParams }: Props) {
  const { emailcheck } = await params;
  const { email } = await searchParams;

  const mbr = await findMemberByEmail(email);
  if (mbr?.emailcheck !== emailcheck)
    redirect(`/sign/error?error=InvalidEmailCheck`);

  await prisma.member.update({
    where: { email },
    data: { emailcheck: null, emailType: null },
  });

  redirect(`/sign?email=${email}`);
}
