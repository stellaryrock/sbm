"use client";

import IconLabelButton from "@/components/icon-label-button";
import { useAlerter } from "@/hooks/contexts/alerter";
import { HeartPlusIcon } from "lucide-react";
import { useTransition, type MouseEvent, type PropsWithChildren } from "react";
import { toggleFollowBook } from "./book.action";

type Props = {
  bookId: number;
  bookOwner: number;
  isActive: boolean;
};

export default function FollowButton({
  bookId,
  bookOwner,
  isActive,
  children,
}: PropsWithChildren<Props>) {
  // const { data: session } = useSession();
  // const userId = Number(session?.user.id);
  const { alert } = useAlerter();
  const [isPending, startTransition] = useTransition();

  // const { iFollowedBooks, toggleFollows } = useStore();

  // const [follows, setFollows] = useOptimistic(book.FollowBook);
  // const router = useRouter();

  // const iFollowed = () => iFollowedBooks.includes(book.id);
  // const iFollowed = () => follows.mapBy("member").includes(userId);

  // const dbData = iFollowed()
  //   ? book.FollowBook.filter(({ member }) => member !== userId)
  //   : [...book.FollowBook, { member: userId }];

  const followBook = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      try {
        // setFollows(dbData);
        await toggleFollowBook(bookId, bookOwner);

        // book.FollowBook = dbData;
        // router.refresh();
        // router.push(path);
      } catch (error) {
        alert(null, error);
        // if (error instanceof Error) alert({ title: error.message });
        // else alert({ title: JSON.stringify(error) });
      }
    });
  };

  return (
    <IconLabelButton
      // onClick={() => toggleFollows(book.id)}
      onClick={followBook}
      noti={"success"}
      icon={<HeartPlusIcon className="size-6 text-green-600" />}
      isActive={isActive}
      disabled={isPending}
    >
      {children}
    </IconLabelButton>
  );
}
