import { SquareLibraryIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ThemeChanger from "../components/theme-changer";
import FallbackImage from "./fallback";
import My from "./my";

export default function Nav() {
  return (
    <div className="flex items-center gap-5">
      <Link href="/bookcase" className="btn-icon">
        <SquareLibraryIcon />
      </Link>
      <ThemeChanger />
      <Suspense fallback={<FallbackImage />}>
        <My />
      </Suspense>
    </div>
  );
}
