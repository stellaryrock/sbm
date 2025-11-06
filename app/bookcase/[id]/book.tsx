import IconLabel from "@/components/icon-label";
import { Button } from "@/components/ui/button";

import ToolTip from "@/components/tool-tip";
import { auth } from "@/lib/auth";
import { findBookWithMarkById, type BookAllColumn } from "@/lib/db";
import { cn } from "@/lib/utils";
import {
  AlbumIcon,
  BookKeyIcon,
  CopyXIcon,
  HeartPlusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { use } from "react";
import BookDialog from "./book-dialog";
import { default as FollowButton } from "./follow-button";
import Mark from "./mark";
import MarkDialog from "./mark-dialog";

type Props =
  | {
      id: number;
      book?: undefined;
    }
  | {
      id?: undefined;
      book: NonNullable<BookAllColumn>;
    };

export default function Book({ id, book }: Props) {
  const data = book ? book : use(findBookWithMarkById(id));

  if (!data)
    return (
      <h1 className="font-semibold text-lg text-muted-foreground">Book is not Found!</h1>
    );

  const {
    id: bookId,
    title,
    remark,
    ispublic,
    member,
    withdel,
    Mark: marks,
    FollowBook: followBooks,
  } = data;
  const session = use(auth());
  const isMine = session?.user.id === String(member);
  const loginUserId = Number(session?.user.id);

  //const totalLikesCnt = book?.Mark.reduce((acc, mark) => acc + mark._count.Likes, 0);

  return (
    <div className="flex w-72 flex-shrink-0 flex-col justify-start rounded-lg bg-slate-200 pl-2 dark:bg-muted">
      <div className="flex items-center justify-between pr-2">
        {process.env.NODE_ENV === "development" && (
          <small className="text-muted-foreground">{bookId}</small>
        )}
        <h1
          className={cn(
            "items-center truncate p-2 font-medium text-xl tracking-tighter",
            ispublic
              ? "text-green-500 text-shadow-green-300"
              : "text-muted-foreground text-shadow-gray-300",
          )}
          title={remark || title}
        >
          {!ispublic && <BookKeyIcon className="inline" />}
          {title}
        </h1>

        {isMine ? (
          <BookDialog book={data}>
            <Button
              variant={"ghost"}
              className="font-semibold text-lg hover:bg-slate-300"
            >
              <MoreHorizontalIcon />
            </Button>
          </BookDialog>
        ) : (
          ispublic && (
            <FollowButton
              bookId={data.id}
              bookOwner={member}
              isActive={followBooks.map(({ member }) => member).includes(loginUserId)}
            >
              {followBooks.length}
            </FollowButton>
          )
        )}
      </div>
      <div className="max-h-full space-y-2 overflow-y-scroll rounded-lg pr-2 pb-3">
        {marks.length ? (
          marks.map((mark) => (
            <Mark
              key={mark.id}
              mark={mark}
              withdel={withdel}
              bookOwner={member}
              followBooks={followBooks.length}
            />
          ))
        ) : (
          <h1 className="rounded-lg bg-white p-5 font-medium text-muted-foreground text-xl">
            There is no Marks.
          </h1>
        )}
      </div>
      {isMine && (
        <div className="my-1 flex items-center justify-between pr-2 font-medium">
          <MarkDialog book={data}>
            <Button
              variant={"ghost"}
              className="flex w-[60%] justify-start font-semibold text-lg hover:bg-slate-300"
            >
              <PlusIcon /> Add a Mark
            </Button>
          </MarkDialog>

          <div className="flex gap-2">
            <IconLabel icon={<AlbumIcon />}>{marks.length}</IconLabel>
            <IconLabel noti={"success"} icon={<ThumbsUpIcon />}>
              {marks.reduce((acc, mark) => acc + mark.Likes.length, 0)}
            </IconLabel>
            {ispublic && (
              <IconLabel
                noti={"destructive"}
                icon={<HeartPlusIcon className="text-red-400" />}
              >
                {followBooks.length}
              </IconLabel>
            )}
            {withdel && (
              <ToolTip content={"With Del"} variant="destructive">
                <CopyXIcon className="text-red-500" />
              </ToolTip>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
