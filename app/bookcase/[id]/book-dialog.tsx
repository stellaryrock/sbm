"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BookData } from "@/lib/db";
import type { ValidError } from "@/lib/validator";
import { useRouter } from "next/navigation";
import { useActionState, type PropsWithChildren } from "react";
import { deleteBook, saveBook } from "./book.action";

export default function BookDialog({
  book = {
    id: 0,
    title: "",
    ispublic: true,
    withdel: false,
    member: 0,
    remark: "",
  },
  children,
}: PropsWithChildren<{
  book?: BookData;
}>) {
  const [validError, save, isPending] = useActionState(
    async (_: ValidError | undefined, formData: FormData) => {
      const err = await saveBook(formData);
      if (err) return err;

      router.refresh();
    },
    undefined,
  );
  const router = useRouter();
  const remove = async () => {
    await deleteBook(book.id);
    router.refresh();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={save} className="my-5">
          <DialogHeader>
            <DialogTitle>{book.id ? "Edit" : "Create"}</DialogTitle>
            <DialogDescription>descript...</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <LabelInput label={"title"} name="title" error={validError} />
            <div className="flex items-center gap-3">
              <Checkbox
                id="ispublic"
                name="ispublic"
                defaultChecked={book.ispublic}
              />
              <Label
                className="font-semibold text-sm capitalize"
                htmlFor="ispublic"
              >
                Public
              </Label>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="withdel"
                  name="withdel"
                  defaultChecked={book.withdel || !!validError?.withdel?.value}
                />
                <Label
                  className="font-semibold text-sm capitalize"
                  htmlFor="withdel"
                >
                  Open With Deletion
                </Label>
              </div>
              <p className="mt-1 text-red-500 text-sm">
                {validError?.withdel?.errors[0]}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Label
                className="font-semibold text-sm capitalize"
                htmlFor="remark"
              >
                Description
              </Label>
              <Textarea
                defaultValue={book.remark ?? ""}
                placeholder="description..."
                name={"remark"}
                id={"remark"}
              />
            </div>
          </div>

          <DialogFooter className="mt-5">
            {!!book.id && (
              <Button onClick={remove} type="button" variant={"destructive"}>
                Delete
              </Button>
            )}
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button type="submit" variant={"outline"} disabled={isPending}>
              {book.id ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
