"use client";

import IconLabelButton from "@/components/icon-label-button";
import type { BookAllColumn } from "@/lib/db";
import { HeartPlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition, type MouseEvent } from "react";
import { toggleFollowBooks } from "./book.action";

export default function FollowIcon({ book }: { book: NonNullable<BookAllColumn> }) {
  const { data: session } = useSession();
  const userId = Number(session?.user.id);
  // const { iFollowedBooks, toggleFollows } = useStore();

  const [follows, setFollows] = useOptimistic(book.FollowBook);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // const iFollowed = () => iFollowedBooks.includes(book.id);
  const iFollowed = () => follows.mapBy("member").includes(userId);

  const dbData = iFollowed()
    ? book.FollowBook.filter(({ member }) => member !== userId)
    : [...book.FollowBook, { member: userId }];

  const followBook = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      try {
        setFollows(dbData);
        await toggleFollowBooks(Number(book.id));

        book.FollowBook = dbData;
        router.refresh();
      } catch (error) {
        if (error instanceof Error) alert({ title: error.message });
        else alert({ title: JSON.stringify(error) });
      }
    });
  };

  return (
    <IconLabelButton
      // onClick={() => toggleFollows(book.id)}
      onClick={followBook}
      icon={<HeartPlusIcon className="size-7 text-green-500" />}
      isActive={iFollowed()}
      disabled={isPending}
    >
      {follows.length}
    </IconLabelButton>
  );
}
