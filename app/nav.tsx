import DummyProfile from "@/public/dummy_profile.png";
import { SquareLibraryIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import ThemeChanger from "../components/theme-changer";
import { auth } from "../lib/auth";

export default function Nav() {
  const session = use(auth());
  const didLogin = !!session?.user;

  return (
    <div className="flex items-center gap-5">
      <Link href="/bookcase" className="btn-icon">
        <SquareLibraryIcon />
      </Link>
      <ThemeChanger />
      {didLogin ? (
        <Link href="/my" className="relative h-[40px] w-[40px] overflow-hidden">
          <Image
            className="rounded-full"
            src={session.user.image ?? DummyProfile}
            alt={session?.user.name || "guest"}
            fill
            unoptimized={process.env.NODE_ENV === "development"}
          />
        </Link>
      ) : (
        <Link href="/sign">Login</Link>
      )}
    </div>
  );
}
