import { redirect } from "next/navigation";
import { use } from "react";
import { auth } from "../../lib/auth";

export default function Bookcase() {
  const session = use(auth());
  const didLogin = !!session?.user;
  if (!session?.user?.id) redirect("/");

  redirect(didLogin ? `/bookcase/${session.user.id}` : "/");
}
