"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useReducer } from "react";

export default function SignForm() {
  const [isSignin, toggleSign] = useReducer((pre) => !pre, false);
  return (
    <>
      {isSignin ? (
        <SignIn toggleSign={toggleSign} />
      ) : (
        <SignUp toggleSign={toggleSign} />
      )}
    </>
  );
}

function SignIn({ toggleSign }: { toggleSign: () => void }) {
  return (
    <>
      <form className="flex flex-col space-y-3">
        <LabelInput
          label="email"
          type="email"
          name="email"
          placeholder="email@bookmark.com"
        />

        <LabelInput
          label="password"
          type="password"
          name="passwd"
          placeholder="your password.."
          className="my-3x"
        />

        <div className="flex justify-between">
          <label htmlFor="remember" className="cursor-pointer">
            <input
              type="checkbox"
              id="remember"
              className="mr-1 translate-y-[1px]"
            />
            Remember me
          </label>

          <Link href="#">Forgot Password?</Link>
        </div>

        <Button type="submit" variant={"primary"} className="w-full">
          Sign In
        </Button>
      </form>
      <div className="mt-5 flex gap-10">
        <span>Dont&apos;t have Account?</span>
        <Link onClick={toggleSign} href="#">
          Sign Up
        </Link>
      </div>
    </>
  );
}

function SignUp({ toggleSign }: { toggleSign: () => void }) {
  return (
    <>
      <form className="flex flex-col space-y-2">
        <LabelInput
          label="email"
          type="email"
          name="email"
          placeholder="email@bookmark.com"
        />

        <LabelInput
          label="password"
          type="password"
          name="passwd"
          placeholder="your password.."
          className="my-3x"
        />

        <LabelInput
          label="password confirm"
          type="password"
          name="passwd2"
          placeholder="your password.."
          className="my-3x"
        />

        <LabelInput
          label="nickname"
          type="text"
          name="nickname"
          placeholder="your nickname.."
          className="my-3x"
        />

        <Button type="submit" variant={"primary"} className="w-full">
          Sign Up
        </Button>
      </form>
      <div className="mt-5 flex gap-10">
        <span>Already have Account?</span>
        <Link onClick={toggleSign} href="#">
          Sign In
        </Link>
      </div>
    </>
  );
}
