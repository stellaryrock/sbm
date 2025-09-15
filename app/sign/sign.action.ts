"use server";

import { signIn, signOut } from "@/lib/auth";

export type Provider = "google" | "github" | "naver" | "kakao";

export const login = async (provider: Provider, callback?: string) => {
  await signIn(provider, { redirectTo: callback || "/bookcase" });
};
export const logout = async () => await signOut({ redirectTo: "/" });
