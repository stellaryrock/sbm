import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

// /forgotpasswd/ADFF-SADF-sadf/
export default async function ResetForgotPasswd({
  params,
}: {
  params: Promise<{ emailcheck: string }>;
}) {
  const { emailcheck } = await params;
  console.log("🚀 ~ emailcheck:", emailcheck);

  const mbr = await prisma.member.findFirst({
    select: { nickname: true, emailcheck: true, email: true },
    where: { emailcheck },
  });
  // compare emailcheck and db's emailcheck
  // TODO: compare emailcheck!!(by crypto)
  // if (!mbr) return <h1>Error</h1>;

  const resetPassword = async () => {
    "use server";
  };
  return (
    <div className="grid h-full place-items-center">
      {/* <div className='w-96 rounded-md border p-5 shadow-md'> */}
      <div className="w-96">
        <h1 className="mb-3 font-semibold text-2xl">Change Password</h1>
        <div className="text-gray-500 text-sm">Hello, {mbr?.nickname}</div>
        <div className="mb-5 text-gray-500 text-sm">Reset your password</div>

        <form action={resetPassword} className="">
          <LabelInput
            label="new password"
            name="passwd"
            type="password"
            focus={true}
            placeholder="new password..."
          />
          <LabelInput
            label="new password confirm"
            name="passwd2"
            type="password"
            placeholder="new password confirm..."
            className="mt-5"
          />

          <Button type="submit" variant={"destructive"} className="my-5 w-full">
            Chagen Password
          </Button>
        </form>
      </div>
    </div>
  );
}
