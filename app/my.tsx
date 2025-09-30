import { auth } from "@/lib/auth";
import { DummyProfile } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function My() {
  const session = await auth();

  return (
    <>
      {session?.user ? (
        <Link href="/my" className="relative h-[40px] w-[40px] overflow-hidden">
          <Image
            className="rounded-full"
            src={session?.user?.image || DummyProfile}
            alt={session?.user.name || "guest"}
            fill
            unoptimized={process.env.NODE_ENV === "development"}
          />
        </Link>
      ) : (
        <Link href="/sign">Login</Link>
      )}
    </>
  );
}
