"use client";

import { DummyProfile } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function My() {
  const session = useSession();
  const didLogin = !!session?.data?.user;

  return (
    <>
      {didLogin ? (
        <Link href="/my" className="relative h-[40px] w-[40px] overflow-hidden">
          <Image
            className="rounded-full"
            src={session?.data?.user?.image ?? DummyProfile}
            alt={session?.data?.user.name || "guest"}
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
