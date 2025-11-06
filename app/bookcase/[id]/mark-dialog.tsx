"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { BookAllColumn } from "@/lib/db";
import type { ValidError } from "@/lib/validator";
import { type PropsWithChildren, useActionState, useState } from "react";
import { createMark } from "./book.action";
import LabelTextarea from "./label-textarea";

export default function MarkDialog({
  book,
  children,
}: PropsWithChildren<{ book: NonNullable<BookAllColumn> }>) {
  const [isOpen, setOpen] = useState(false);
  const [validError, addMark, isPending] = useActionState(
    async (_: ValidError | undefined, formData: FormData) => {
      const { id: bookId, member: bookOwner } = book;

      const err = await createMark(formData, bookId, bookOwner);
      if (err) return err;

      setOpen(false);
    },
    undefined,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={addMark} className="my-5">
          <DialogHeader>
            <DialogTitle>Add a Mark</DialogTitle>
            <DialogDescription>descript...</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <LabelInput
              label={"title"}
              name="title"
              placeholder={"title..."}
              error={validError}
            />
            <LabelInput
              label={"link"}
              name="link"
              defaultValue={"https://"}
              error={validError}
            />
            <LabelInput
              label={"image"}
              name="image"
              placeholder="image..."
              error={validError}
            />

            <LabelTextarea label={"description"} error={validError} name="descript" />
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending} variant={"outline"}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
