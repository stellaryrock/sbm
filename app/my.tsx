import UserAvatar from "@/components/user-avatar";
import { auth } from "@/lib/auth";
import { existsFile } from "@/lib/validator";
import Link from "next/link";

export default async function My() {
  const session = await auth();

  return (
    <>
      {session?.user ? (
        <Link href="/my" className="relative overflow-hidden rounded-full border">
          <UserAvatar
            member={{
              id: Number(session.user.id),
              nickname: session.user.name || "",
              image: existsFile(session.user.image),
              // image: session.user.image ?? DummyProfile.src
            }}
          />
        </Link>
      ) : (
        <Link href="/sign">Login</Link>
      )}
    </>
  );
}
