"use client";
import type { UpdateProfileImageReturn } from "@/app/sign/sign.action";
import { cn, DummyProfile } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image, { type StaticImageData } from "next/image";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";

type Props = {
  src?: string | StaticImageData;
  alt?: string;
  changeImage: (formData: FormData) => UpdateProfileImageReturn;
};

export default function ImageUploader({ src, alt, changeImage }: Props) {
  const { update } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [img, setImg] = useState(src);
  const [isDragging, setDragging] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const setImageFile = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files?.length) return;
    setPreview(evt.target.files[0]);
  };

  const setPreview = (file: File, needSubmit: boolean = true) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) setImg(e.target.result as string);
      if (needSubmit) formRef.current?.requestSubmit();
    };
    reader.readAsDataURL(file);
  };

  const dropFile = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);
    const files = e.dataTransfer.files;

    if (files?.length) {
      const file = files[0];
      setPreview(file, false);

      const formData = new FormData();
      formData.append("image", file);
      uploadImage(formData);
    }
  };

  const [isPending, startTransition] = useTransition();

  const uploadImage = (formData: FormData) => {
    setErrorMsgs([]);
    startTransition(async () => {
      if (!changeImage) return;
      const [err, mbr] = await changeImage(formData);

      if (typeof err?.image === "object" && err?.image?.errors.length)
        return setErrorMsgs(err.image.errors);

      await update(mbr);
    });
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    uploadImage(formData);
  };

  return (
    <form onSubmit={submitHandler} ref={formRef}>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <file attach> */}
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
        <Image
          src={img || DummyProfile}
          alt={alt || "guest"}
          onClick={() => fileRef.current?.click()}
          className={"h-full w-full cursor-pointer object-cover"}
          unoptimized={process.env.NODE_ENV === "development"}
          onError={() => setImg(DummyProfile)}
          fill
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
      </div>
      <div>
        {errorMsgs.map((emsg) => (
          <p key={emsg} className="text-red-500">
            {emsg}
          </p>
        ))}
      </div>
    </form>
  );
}
