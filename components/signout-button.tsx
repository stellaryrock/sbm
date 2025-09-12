"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { logout } from "../app/sign/sign.action";
import { Button } from "./ui/button";

export default function SignOutButton() {
  const session = useSession();
  if (!session?.data?.user) redirect("/");

  return (
    <form action={logout}>
      <Button variant={"success"}>Sign Out {session.data?.user?.name}</Button>
    </form>
  );
}
