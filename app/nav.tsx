import Img from "@/components/ui/img";
import DummyProfile from "@/public/dummy_profile.png";
import { SquareLibraryIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import ThemeChanger from "../components/theme-changer";
import { auth } from "../lib/auth";

export default function Nav() {
  const session = use(auth());
  console.log("🚀 ~ Nav ~ session:", session);
  const didLogin = !!session?.user;

  return (
    <div className="flex items-center gap-5">
      <Link href="/bookcase" className="btn-icon">
        <SquareLibraryIcon />
      </Link>
      <ThemeChanger />
      {didLogin ? (
        <Link href="/my">
          <Img
            className="rounded-full"
            src={session.user.image ?? DummyProfile.src}
            alt={session?.user.name || "guest"}
            width={30}
            height={30}
          />
        </Link>
      ) : (
        <Link href="/sign">Login</Link>
      )}
    </div>
  );
}
