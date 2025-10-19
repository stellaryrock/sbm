import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 } from "uuid";

export { default as DummyProfile } from "@/public/profile_dummy.png";
export const DummyProfileFile = "/profile_dummy.png";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const newToken = () => v4();

export const uniqNumId = (cnt = 5) =>
  Math.random()
    .toString(10)
    .substring(2, 2 + cnt);

export const uniqId = (cnt = 5) =>
  Math.random()
    .toString(10)
    .substring(2, 2 + cnt);

export const DynamicCsses = [
  "translate-x-[-20px]",
  "translate-x-[-40px]",
  "translate-x-[-60px]",
  "translate-x-[-80px]",
  "translate-x-[-100px]",
  "translate-x-[-120px]",
];
