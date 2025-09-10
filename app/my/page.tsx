"use client";
import { ActionButton } from "@/components/action-button";
import { logout } from "../sign/sign.action";

export default function My() {
  return (
    <div className="grid h-full place-items-center">
      <div>
        <h1 className="text-3xl">My</h1>
        <ActionButton variant={"success"} serverAction={logout}>
          Sign Out
        </ActionButton>
      </div>
    </div>
  );
}
