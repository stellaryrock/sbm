import { SquareLibraryIcon } from "lucide-react";
import Link from "next/link";
import ThemeChanger from "../components/theme-changer";
import My from "./my";

export default function Nav() {
  return (
    <div className="flex items-center gap-5">
      <Link href="/bookcase" className="btn-icon">
        <SquareLibraryIcon />
      </Link>
      <ThemeChanger />
      <My />
    </div>
  );
}
