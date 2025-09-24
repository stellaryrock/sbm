import ImageUploader from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use } from "react";
import SignOutButton from "../../components/signout-button";
import { updateProfileImage } from "../sign/sign.action";
import ChangeProfile from "./change-profile";

export default function My() {
  const session = use(auth());
  console.log("🚀 ~ My ~ session:", session);

  if (!session?.user?.name) redirect("/sign");

  const { name, image } = session.user;

  return (
    <div className="grid h-full place-items-center">
      <div className="w-full rounded-md border p-5 text-center shadow-md">
        <h1 className="mb-5 text-3xl">My Page</h1>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <ImageUploader
              changeImage={updateProfileImage}
              src={image}
              alt={name}
            />
            <div className="flex items-center justify-around">
              <Link href="/api/auth/signout">Goto SignOut</Link>
              <SignOutButton name={session?.user.name} />
              <Button variant="destructive">Withdraw </Button>
            </div>
          </div>
          <div className="col-span-2">
            <ChangeProfile />
          </div>
        </div>
      </div>
    </div>
  );
}
