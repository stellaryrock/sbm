import SignOutButton from "@/components/signout-button";
import Link from "next/link";

export default function My() {
  return (
    <div className="grid h-full place-items-center">
      <div className="w-96 border p-5 text-center">
        <h1 className="mb-5 text-3xl">My Page</h1>
        <div className="flex justify-around">
          <Link href="/api/auth/signout">Goto SignOut</Link>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
