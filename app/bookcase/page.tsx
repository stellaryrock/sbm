import { redirect } from "next/navigation";
import { use } from "react";
import { auth } from "../../lib/auth";

export default function Bookcase() {
  const session = use(auth());
  console.log("🚀 ~ Bookcase ~ session:", session);
  const didLogin = !!session?.user;
  console.log("bookcase::", session?.user?.name);
  if (!session?.user?.name) redirect("/");
  const nickname = encodeURI(session.user.name);

  redirect(didLogin ? `/bookcase/${nickname}` : "/");
}
