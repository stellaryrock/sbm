import ImageUploader from "@/components/image-uploader";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { use } from "react";
import SignOutButton from "../../components/signout-button";
import { updateProfileImage } from "../sign/sign.action";
import ChangeProfile from "./change-profile";
import WithdrawButton from "./withdraw-button";

export default function My() {
  const session = use(auth());

  if (session?.user.name)
    console.log("🚀 ~ My ~ session name:", session.user.name);

  if (!session?.user?.name) redirect("/sign");

  const { name, image } = session.user;

  return (
    <div className="container mx-auto grid h-full place-items-center">
      <div className="w-full rounded-md border p-5 text-center shadow-md">
        <h1 className="mb-5 text-3xl">My Page</h1>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 flex flex-col justify-between">
            <ImageUploader
              changeImage={updateProfileImage}
              src={image || ""}
              alt={name}
            />
          </div>
          <div className="col-span-2">
            <ChangeProfile user={session.user} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <SignOutButton name={name} />
          <div className="col-span-2 text-right">
            <WithdrawButton />
          </div>
        </div>
      </div>
    </div>
  );
}
