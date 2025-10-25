"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { validate, validateAsync } from "@/lib/validator";
import z from "zod";

export const saveBook = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");

  const member = Number(session.user.id);

  const zobj = z
    .object({
      title: z.string().min(1),
      ispublic: z.string().optional(),
      withdel: z.string().optional(),
      remark: z.string().optional(),
    })
    .refine(({ ispublic, withdel }) => !ispublic || (ispublic && !withdel), {
      path: ["withdel"],
      message: "Public book cannot have open with deletion",
    });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const id = Number(formData.get("id"));
  const { id: userId, isadmin } = session.user;
  if (id) {
    await prisma.book.update({
      where: isadmin ? { id } : { id, member: Number(userId) },
      data: {
        ...data,
        ispublic: data.ispublic === "on",
        withdel: !!data.withdel,
      },
    });
  } else {
    await prisma.book.create({
      data: {
        ...data,
        ispublic: data.ispublic === "on",
        withdel: !!data.withdel,
        member,
      },
    });
  }
};

const checkLogin = async () => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");

  return session.user;
};

export const deleteBook = async (id: number) => {
  const user = await checkLogin();
  // check exists
  const zobj = z
    .object({
      id: z.number(),
    })
    .superRefine(async ({ id }, ctx) => {
      const book = await prisma.book.findUnique({
        where: { id },
        //where: { id: id + 10000 },
      });

      if (!book) {
        ctx.addIssue({
          code: "custom",
          message: `This Book(#${id}) is not exists!`,
          path: ["id"],
        });
      }
    });

  const [err] = await validateAsync(zobj, { id });
  if (err) return err;

  const { id: userId, isadmin } = user;

  await prisma.book.delete({
    where: isadmin ? { id } : { id, member: Number(userId) },
  });
};

export const likesAndReports = async (member: number) => {
  const ilikes = await prisma.likes.findMany({
    where: { member },
    select: { mark: true },
  });

  const ireports = await prisma.report.findMany({
    where: { member },
    select: { mark: true },
  });

  return [ilikes, ireports];
};

export const deleteMark = async (id: number, bookOwner: number) => {
  const { id: userId, isadmin } = await checkLogin();

  // check exists
  const mark = await prisma.mark.findUnique({
    where: isadmin ? { id } : { id, maker: Number(userId) },
  });

  if (!mark) throw new Error("Mark Not Found!");

  if (!isadmin && Number(userId) !== bookOwner && mark.maker !== Number(userId))
    throw new Error("You have not authentication");

  await prisma.mark.delete({
    where: { id },
  });
};
