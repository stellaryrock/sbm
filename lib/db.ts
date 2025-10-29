"only server";

import { PrismaClient } from "@/lib/generated/prisma/client";

const newInstance = () => new PrismaClient();

// biome-ignore lint/suspicious/noShadowRestrictedNames: for too many connections problems
declare const globalThis: {
  prismaGlobal: ReturnType<typeof newInstance>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? new PrismaClient();

export default prisma;
globalThis.prismaGlobal = prisma;

export const findMemberByEmail = async (email: string, passwd: boolean = false) =>
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
export type MemberWithCount = Awaited<ReturnType<typeof findMemberByIdWithCount>>;
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

export type BookAllColumn = Awaited<ReturnType<typeof findBookWithMarkById>>;
export type BookData = Omit<
  NonNullable<BookAllColumn>,
  "Mark" | "createdAt" | "updatedAt"
>;

export const findBookById = async (id: number) =>
  prisma.book.findUnique({
    where: { id },
  });

export const findBookWithMarkById = async (id: number) =>
  prisma.book.findUnique({
    where: { id },
    include: {
      Mark: {
        include: {
          Likes: { select: { member: true } },
          Report: { select: { member: true } },
          Talk: true,
        },
      },
      FollowBook: {
        select: { member: true },
      },
    },
  });

export type MarkAllColumn = NonNullable<Awaited<ReturnType<typeof findMarkWithCount>>>;
export type MarkData = Omit<MarkAllColumn, "_count" | "createdAt" | "updatedAt">;
export const findMarkWithCount = async (id: number) =>
  prisma.mark.findUnique({
    where: { id },
    include: {
      // _count: { select: { Likes: true, Talk: true, Report: true } },
      Likes: { select: { member: true } },
      Report: { select: { member: true } },
      Talk: true,
    },
  });
