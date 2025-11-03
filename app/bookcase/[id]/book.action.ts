"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { validate, validateAsync } from "@/lib/validator";
import { revalidateTag, unstable_cache } from "next/cache";
import z from "zod";

const checkLogin = async () => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");

  return session.user;
};

export const getAllBooksByMember = async (member: number) =>
  // ! revalidateTag 에 잘못된 값이 들어가도 확인이 어려움. 오타 조심, 빌드 후 실행해서 확인.
  // ! SQL로 데이터 추가 후에 브라우저에서 해당 데이터가 보이면 캐시 안된 상태, revalidate 후에 추가된 데이터가 보여야 함.

  unstable_cache(
    async () =>
      prisma.book.findMany({
        where: { member },
        include: {
          FollowBook: { select: { member: true } },
          Mark: {
            include: {
              Likes: { select: { member: true } },
              Report: { select: { member: true } },
              Talk: true,
              Member: { select: { id: true, image: true, nickname: true } },
            },
          },
        },
      }),
    [`member-books-${member}`], // ! cache-key
    { tags: [`member-books-${member}`] }, // options
  )();

export const saveBook = async (formData: FormData) => {
  const user = await checkLogin();

  const member = Number(user.id);

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
  const bookOwner = Number(formData.get("bookOwner"));

  const { id: userId, isadmin } = user;
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

  revalidateTag(`member-books-${bookOwner}`);
};

export const deleteBook = async (id: number, bookOwner: number) => {
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

  revalidateTag(`member-books-${bookOwner}`);
};

export const likesAndReportsWithFollows = async (member: number) => {
  const ilikes = await prisma.likes.findMany({
    where: { member },
    select: { mark: true },
  });

  const ireports = await prisma.report.findMany({
    where: { member },
    select: { mark: true },
  });

  const ifollows = await prisma.followBook.findMany({
    where: { member },
    select: { book: true, Book: { select: { member: true } } },
  });
  console.log("🚀 ~ likesAndReportsWithFollows ~ ifollows:", ifollows);

  return [ilikes, ireports, ifollows] as const;
};

export const deleteMark = async (id: number, bookOwner: number) => {
  const { id: userId, isadmin } = await checkLogin();

  // check exists
  const mark = await prisma.mark.findUnique({
    where: { id },
  });

  if (!mark) throw new Error("Mark Not Found!");

  if (!isadmin && Number(userId) !== bookOwner && mark.maker !== Number(userId))
    throw new Error("You have not authentication");

  await prisma.mark.delete({
    where: { id },
  });

  console.log("🚀 expire tag:", `member-books-${bookOwner}`);
  revalidateTag(`member-books-${bookOwner}`);
};

export const toggleFollowBook = async (book: number, bookOwner: number) => {
  const { id } = await checkLogin();
  const member = Number(id);
  const fb = await prisma.followBook.findUnique({
    where: { book_member: { book, member } },
  });

  if (fb)
    await prisma.followBook.delete({
      where: { book_member: { book, member } },
    });
  else
    await prisma.followBook.create({
      data: { book, member },
    });

  console.log("🚀 expire tag:", `member-books-${bookOwner}`);
  revalidateTag(`member-books-${bookOwner}`);
  // revalidatePath(`/bookcase/${bookOwner}`);
};

export const toggleFollowBooks = async (book: number, bookOwner: number) => {
  const { id: userId } = await checkLogin();
  const member = Number(userId);

  const followCnt = await prisma.followBook.count({
    where: { book },
  });

  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // if (book === 17) throw new Error();

  if (followCnt > 0)
    await prisma.followBook.delete({
      where: { book_member: { book, member } },
    });
  else
    await prisma.followBook.create({
      data: { book, member },
    });

  console.log("🚀 expire tag:", `member-books-${bookOwner}`);
  revalidateTag(`member-books-${bookOwner}`);
};

export const toggleLikesOrReportMark = async (
  mark: number,
  type: "likes" | "reports",
  bookOwner: number,
) => {
  const { id: userId } = await checkLogin();
  const member = Number(userId);

  // const isLikes = type === 'likes';
  // const model = isLikes ? prisma.likes : prisma.report;
  const data = { mark, member };
  const where = { where: data };
  const whereMarkMember = { where: { mark_member: data } };

  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // if (mark === 1) throw new Error();
  // select count(*) from Likes where mark = mark and member = userid;
  const likesCnt = await (type === "likes"
    ? prisma.likes.count(where)
    : prisma.report.count(where));

  if (likesCnt > 0) {
    await (type === "likes"
      ? prisma.likes.delete(whereMarkMember)
      : prisma.report.delete(whereMarkMember));
  } else {
    await (type === "likes"
      ? prisma.likes.create({ data })
      : prisma.report.create({ data }));
  }

  console.log("🚀 expire tag:", `member-books-${bookOwner}`);
  revalidateTag(`member-books-${bookOwner}`);
};
