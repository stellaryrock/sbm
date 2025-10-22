import IconLabel from "@/components/icon-label";
import { Button } from "@/components/ui/button";

import ToolTip from "@/components/tool-tip";
import { auth } from "@/lib/auth";
import { findBookWithMarkById, type BookAllColumn } from "@/lib/db";
import { cn } from "@/lib/utils";
import {
  CopyXIcon,
  MoreHorizontalIcon,
  PlusIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { use } from "react";
import Mark from "./mark";

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
      <h1 className="font-semibold text-lg text-muted-foreground">
        Book is not Found!
      </h1>
    );
  const { id: bookId, title, remark, ispublic, member, withdel } = data;
  const session = use(auth());
  const isMine = session?.user.id === String(member);
  return (
    <div className="flex w-80 flex-shrink-0 flex-col justify-start rounded-lg bg-slate-200 pl-2">
      <div className="flex items-center justify-between pr-2">
        <h1
          className={cn(
            "m-2 w-36 truncate font-medium text-xl tracking-tighter",
            ispublic
              ? "text-green-500 text-shadow-green-300"
              : "text-muted-foreground text-shadow-gray-300",
          )}
        >
          {title}
        </h1>

        {isMine ? (
          <Button
            variant={"ghost"}
            className="font-semibold text-lg hover:bg-slate-300"
          >
            <MoreHorizontalIcon />
          </Button>
        ) : (
          <Button
            variant={"ghost"}
            className="font-semibold text-lg hover:bg-slate-300"
          >
            <IconLabel
              noti={"success"}
              icon={<UserRoundPlusIcon className="text-green-500" />}
            >
              30
            </IconLabel>
          </Button>
        )}
      </div>
      <div className="max-h-full space-y-2 overflow-y-scroll rounded-lg pr-2 pb-3">
        <Mark />
        <Mark />
        <Mark />
      </div>
      {isMine && (
        <div className="my-1 flex items-center justify-between pr-2 font-medium">
          <Button
            variant={"ghost"}
            className="flex w-[80%] justify-start font-semibold text-lg hover:bg-slate-300"
          >
            <PlusIcon /> Add a Mark
          </Button>
          {true && (
            <ToolTip content={"open with deletion"}>
              <CopyXIcon className="text-red-500" />
            </ToolTip>
          )}
        </div>
      )}
    </div>
  );
}
