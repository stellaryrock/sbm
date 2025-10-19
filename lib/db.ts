import { PrismaClient } from "@/lib/generated/prisma/client";

const prisma = new PrismaClient();

export default prisma;

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
      image: true,
      outdt: true,
      emailType: true,
      passwd,
    },
    where: { email },
  });

export const findMemberByEmailcheck = async (
  emailcheck: string,
  passwd: boolean = false,
) =>
  prisma.member.findFirst({
    select: {
      id: true,
      nickname: true,
      isadmin: true,
      emailcheck: true,
      emailType: true,
      image: true,
      outdt: true,
      passwd,
    },
    where: { emailcheck },
  });

export type Member = Awaited<ReturnType<typeof findMemberById>>;
export type MemberWithCount = Awaited<
  ReturnType<typeof findMemberByIdWithCount>
>;
export const findMemberById = async (id: number | string) =>
  prisma.member.findUnique({
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      isadmin: true,
    },
    where: { id: Number(id) },
  });

export const findMemberByIdWithCount = async (id: number | string) =>
  prisma.member.findUnique({
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      isadmin: true,
      _count: { select: { Book: true, Mark: true } },
    },
    where: { id: Number(id) },
  });
