"use server";

import { signOut } from "@/lib/auth";

export const logout = async () => await signOut({ redirectTo: "/" });
export const login = async (formData: FormData) => {
  const ent = Object.fromEntries(formData.entries());

  const { email, password } = ent;

  console.log("🚀 ~ login ~ password:", password);
  console.log("🚀 ~ login ~ email:", email);
};
