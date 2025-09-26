import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { use } from "react";
import ChangeEmail from "./change-email";
import ChangeNickname from "./change-nickname";
import ChangePassword from "./change-password";

export default function ChangeProfile() {
  // const { data: session } = useSession({ required: true });
  // const changePasswordRef = useRef<HTMLFormElement>(null);
  // const changeNicknameRef = useRef<HTMLFormElement>(null);
  // const changeEmailRef = useRef<HTMLFormElement>(null);

  // const resetHandler = () => {
  //   changeNicknameRef.current?.reset();
  //   changePasswordRef.current?.reset();
  //   changeEmailRef.current?.reset();
  // };

  const session = use(auth());
  if (!session?.user.email) redirect("/sign");
  const { email } = session.user;

  return (
    <form className="space-y-3 text-left">
      <div>
        <ChangeNickname email={email} defaultValue={session?.user.name ?? ""} />
      </div>
      <div>
        <ChangeEmail defaultValue={email} />
      </div>
      <div>
        <ChangePassword />
      </div>
    </form>
  );
}
