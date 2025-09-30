"use client";

import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export default function SignOutButton() {
  const session = useSession();
  if (!session?.data?.user) redirect("/sign");

  return (
    <form action={async () => signOut({ redirectTo: "/sign" })}>
      <Button variant={"success"}>
        <LogOutIcon /> Sign Out {session.data.user.name}
      </Button>
    </form>
  );
}
