"use client";
import type { Member } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import type { ValidError } from "@/lib/validator";
import DummyProfile from "@/public/dummy_profile.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import Img from "./ui/img";

type Props = {
  src?: string | null | undefined;
  alt?: string;
  changeImage: (formData: FormData) => Promise<[ValidError] | [null, Member]>;
};

export default function ImageUploader({ src, alt, changeImage }: Props) {
  const { update } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [img, setImg] = useState(src);
  const [isDragging, setDragging] = useState(false);
  const router = useRouter();

  const setImageFile = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files?.length) return;
    setPreview(evt.target.files[0]);
  };

  const setPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) setImg(e.target.result as string);
      formRef.current?.requestSubmit();
    };
    reader.readAsDataURL(file);
  };

  const dropFile = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;

    if (files?.length) {
      const file = files[0];
      setPreview(file);

      const formData = new FormData();
      formData.set("image", file);
      submitForm(formData);
    }
  };

  const [isPending, startTransition] = useTransition();

  const submitForm = (formData: FormData) => {
    startTransition(async () => {
      if (!changeImage) return;
      const [err, mbr] = await changeImage(formData);
      if (err) return console.log(err);

      await update(mbr);
      router.refresh();
    });
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitForm(formData);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <file attach>
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
      }}
      onDrop={dropFile}
      className={cn(
        "relative mx-auto aspect-square w-full max-w-96 overflow-hidden rounded-full border-2 shadow-sm",
        { "border-blue-500 border-dotted": isDragging },
      )}
    >
      <form onSubmit={submitHandler} className="" ref={formRef}>
        <Img
          src={img || DummyProfile.src}
          alt={alt}
          onClick={() => fileRef.current?.click()}
          className={"h-full w-full cursor-pointer object-cover"}
        />
        <input
          type="file"
          name="image"
          ref={fileRef}
          accept="image/*"
          onChange={setImageFile}
          disabled={isPending}
          hidden
        />
      </form>
    </div>
  );
}
