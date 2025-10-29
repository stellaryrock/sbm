import IconLabel from "@/components/icon-label";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { auth } from "@/lib/auth";
import prisma, { findMemberByIdWithCount } from "@/lib/db";
import { AlbumIcon, BookMarkedIcon, HeartPlusIcon, PlusIcon } from "lucide-react";
import { use } from "react";
import Book from "./book";
import BookDialog from "./book-dialog";

type Props = {
  params: Promise<{ id: string }>;
};

export default function BookcaseNickname({ params }: Props) {
  const { id } = use(params);
  const session = use(auth());
  // const userId = Number(session?.user.id);
  const isMyBookcase = session?.user.id === id;
  const mbr = use(findMemberByIdWithCount(id));
  if (!mbr) return <h1 className="text-2xl">User Not Found</h1>;

  const books = use(
    prisma.book.findMany({
      where: { member: Number(id) },
      include: {
        FollowBook: { select: { member: true } },
        Mark: {
          include: {
            // select count(*) from Likes where book = parent.book;
            // _count: { select: { Likes: true, Report: true, Talk: true } },
            // Likes: true, // select * from Likes where mark = parent.mark;
            Likes: { select: { member: true } },
            Report: { select: { member: true } },
            Talk: true,
          },
        },
      },
    }),
  );

  const totalFollowsCnt = books.reduce((acc, cur) => acc + cur.FollowBook.length, 0);

  // books.forEach((book) => {
  //   book.Mark.forEach((mark) => {
  //     mark.iliked = mark.Likes.map((like) => like.member).includes(userId);
  //   });
  // });

  return (
    <div className="flex max-h-full flex-col px-2 pt-2">
      <h1 className="flex items-center justify-between font-semibold text-2xl">
        <div className="flex items-center">
          {/* <UserAvatar id={id} withName={true} /> */}
          {mbr && <UserAvatar member={mbr} withName={true} />}
          <span className="ml-2 font-medium text-green-600">Bookcase</span>
        </div>
        <span className="flex gap-3 text-lg">
          <IconLabel icon={<BookMarkedIcon />}>{mbr._count.Book}</IconLabel>
          <IconLabel icon={<AlbumIcon />} noti="primary">
            {mbr._count.Mark}
          </IconLabel>
          <IconLabel icon={<HeartPlusIcon />} noti="destructive">
            {totalFollowsCnt}
          </IconLabel>
        </span>
      </h1>

      <div className="flex gap-3 overflow-x-auto py-2">
        {books.map((book) => (
          <Book key={book.id} book={book} />
        ))}
        {isMyBookcase && (
          <BookDialog>
            <Button
              variant={"ghost"}
              className="flex w-96 justify-start rounded-full bg-slate-200 font-semibold text-lg hover:bg-muted-foreground dark:bg-muted dark:hover:bg-muted-foreground/30"
            >
              <PlusIcon /> Add a Book
            </Button>
          </BookDialog>
        )}
      </div>
    </div>
  );
}
