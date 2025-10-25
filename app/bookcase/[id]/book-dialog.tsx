"use client";

import CheckSwitch from "@/components/check-switch";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAlerter } from "@/hooks/contexts/alerter";
import type { BookData } from "@/lib/db";
import type { ValidError } from "@/lib/validator";
import { useRouter } from "next/navigation";
import { useActionState, useState, type PropsWithChildren } from "react";
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
  // const [ispublic, setPublic] = useState(false);
  // const [withdel, setWithdel] = useState(false);

  const { confirm, alert, prompt } = useAlerter();
  const [isOpen, setOpen] = useState(false);

  const [validError, save, isPending] = useActionState(
    async (_: ValidError | undefined, formData: FormData) => {
      //formData.set("ispublic", ispublic ? "on" : "");
      formData.set("id", String(book.id));
      const err = await saveBook(formData);
      if (err) return err;

      router.refresh();
      setOpen(false);
    },
    undefined,
  );
  const router = useRouter();
  const remove = async () => {
    // if (!confirm("Are u sure??")) return;
    const ret = await confirm({ title: "Are u sure??" });
    if (!ret) return;

    const code = await prompt({
      title: "Inout the code ?",
      description: "Input the code to delete this book",
      placeholder: "code...",
    });

    if (code !== "1234") {
      await alert({ title: "Not valid code!", variant: "destructive" });
      return;
    }

    const err = await deleteBook(book.id);
    if (err) {
      console.log("Err>>", err.id.errors[0]);
      setOpen(false);
      await confirm({ title: err.id.errors[0] });
      return;
    }

    router.refresh();
    setOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={save} className="my-5">
          <DialogHeader>
            <DialogTitle>{book.id ? "Edit" : "Create"}</DialogTitle>
            <DialogDescription>descript...</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <LabelInput
              label={"title"}
              name="title"
              defaultValue={book.title}
              error={validError}
            />
            <div className="flex items-center gap-3">
              <CheckSwitch
                name="ispublic"
                label="Public Book"
                checkValue={book.ispublic}
                error={validError}
                type={"checkbox"}
              />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <CheckSwitch
                  label="Open with deletion"
                  name="withdel"
                  error={validError}
                  checkValue={book.withdel}
                  type={"switch"}
                />
              </div>
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
