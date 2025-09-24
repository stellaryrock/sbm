import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const newToken = () => v4();

export const uniqueNumId = (cnt = 5) =>
  Math.random()
    .toString(10)
    .substring(2, 2 + cnt);

export const uniqueId = (cnt = 5) =>
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
