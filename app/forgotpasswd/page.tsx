import Link from "next/link";
import LabelInput from "../../components/label-input";
import { Button } from "../../components/ui/button";

export default function ForgotPassword() {
  const sendResetPasswd = async () => {
    "use server";
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex w-96 flex-col gap-3">
        <h1 className="text-3xl">Forgot Password</h1>
        <div className="mb-5 text-gray-500 text-sm">
          Enter your email address when joined, and send to instructions to
          reset password.
        </div>
        <form action={sendResetPasswd}>
          <LabelInput
            label="email"
            name="email"
            focus={true}
            placeholder="email@bookmark.com"
          />

          <Button type="submit" variant="success" className="my-4 w-full">
            Send Instructions email
          </Button>

          <div className="text-center">
            Back to <Link href="/sign">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
