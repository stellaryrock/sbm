"use client";

import IconLabelButton from "@/components/icon-label-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAlerter } from "@/hooks/contexts/alerter";
import type { MarkAllColumn } from "@/lib/db";
import {
  BookmarkXIcon,
  HatGlassesIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition, type MouseEvent } from "react";
import { deleteMark, toggleLikesOrReportMark } from "./book.action";

export default function Mark({
  mark,
  bookOwner,
  withdel,
}: {
  mark: MarkAllColumn;
  bookOwner: number;
  withdel: boolean;
}) {
  const { data: session } = useSession();
  const userId = Number(session?.user.id);
  // const [likes, setLikes] = useState(mark.Likes);
  const [likes, setLikes] = useOptimistic(mark.Likes);
  const [reports, setReports] = useOptimistic(mark.Report);
  const [isPending, startTransition] = useTransition();

  // const { iLikedMarks, iReportedMarks, toggleLikes, toggleReports } = useStore();
  // if (mark.id === 4)
  // console.log("🚀 ~ iLikedMarks:", iLikedMarks, mark.id, iLikedMarks.includes(mark.id));
  const router = useRouter();
  const { alert } = useAlerter();

  const iLiked = () => likes.map(({ member }) => member).includes(userId);
  const iReported = () => reports.map(({ member }) => member).includes(userId);

  const likeOrReportMark = (
    e: MouseEvent<HTMLButtonElement>,
    type: "likes" | "reports",
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const hasNow = type === "likes" ? iLiked() : iReported();
    const col = type === "likes" ? likes : reports;
    const dbData = hasNow
      ? col.filter(({ member }) => member !== userId)
      : [...col, { member: userId }];

    startTransition(async () => {
      try {
        (type === "likes" ? setLikes : setReports)(dbData);
        await toggleLikesOrReportMark(mark.id, type);

        if (type === "likes") mark.Likes = dbData;
        else mark.Report = dbData;
      } catch (error) {
        if (error instanceof Error) alert({ title: error.message });
        else alert({ title: JSON.stringify(error) });
      }
    });
  };

  const likeMark = (e: MouseEvent<HTMLButtonElement>) => likeOrReportMark(e, "likes");
  const reportMark = (e: MouseEvent<HTMLButtonElement>) => likeOrReportMark(e, "reports");

  const openLinkTrigger = async () => {
    // 좋아요 한 마크는 바로삭제에서 제외!
    if (!withdel || mark.Likes.length) return;

    try {
      await deleteMark(mark.id, bookOwner);
      router.refresh();
    } catch (error) {
      console.log(error);
      await alert({ title: (error as Error).message });
    }
  };

  return (
    <div className="group rounded-lg bg-white px-2 pt-2 pb-0.5 shadow-md hover:bg-slate-50 hover:shadow-lg">
      <Link
        href={mark.link}
        onClick={openLinkTrigger}
        target="_blank"
        rel="noopener noreferrer" // target='_blank' 의 취약점 보완
        className="mark"
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-16 w-auto max-w-[50%] rounded-lg group-hover:ring-2 group-hover:ring-primary">
            <AvatarImage
              src={mark.image || "/site_dummy.jpg"}
              className="aspect-auto size-auto"
            />
            <AvatarFallback className="w-full">
              {mark.title.substring(0, 8)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden [&>*]:truncate">
            <h1 className="text-lg dark:text-black/70" title={mark.title}>
              {process.env.NODE_ENV === "development" && (
                <small className="text-muted-foreground">{mark.id}</small>
              )}
              {mark.title}
            </h1>
            <small className="text-muted-foreground">{mark.descript || mark.title}</small>
            <small className="text-muted-foreground underline-offset-2 group-hover:underline">
              {mark.link}
            </small>
          </div>
        </div>
        <Separator className="mt-2 mb-0.5 bg-muted-foreground/30" />
        <div className="flex items-center justify-between text-sm">
          <IconLabelButton
            icon={<ThumbsUpIcon />}
            onClick={likeMark}
            // onClick={(e) => likeOrReportMark(e, "likes")}
            // isActive={iLikedMarks.includes(mark.id)}
            isActive={iLiked()}
            disabled={isPending}
          >
            {likes.length}
          </IconLabelButton>
          <IconLabelButton icon={<MessageCircleIcon />}>
            {mark.Talk.length}
          </IconLabelButton>
          <IconLabelButton
            icon={<HatGlassesIcon />}
            onClick={reportMark}
            isDanger
            isActive={iReported()}
            disabled={isPending}
          >
            {reports.length}
          </IconLabelButton>
          <IconLabelButton
            icon={<BookmarkXIcon className="size-5" />}
            tooltip="Delete this right away"
            isDanger
          />
          <IconLabelButton icon={<MoreHorizontalIcon />} />
        </div>
      </Link>
    </div>
  );
}
