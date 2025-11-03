import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 } from "uuid";

export { default as DummyProfile } from "@/public/profiles/profile_dummy.png";
export const DummyProfileFile = "/profiles/profile_dummy.png";
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
  "translate-x-1",
  "translate-x-1.5",
  "translate-x-2",
  "translate-x-2.5",
  "translate-x-3",
  "translate-x-3.5",
  "translate-x-4",
  "translate-x-4.5",
  "translate-x-5",
];

declare global {
  interface Array<T> {
    mapBy<P extends keyof T>(prop: P): T[P][];
    //filterBy
  }

  // interface Number {
  //   truncate(suffix: "K" | "M", precision?: number): string;
  // }
}

Array.prototype.mapBy = function <T, P extends keyof T>(this: T[], prop: P): T[P][] {
  return this.map((element) => element[prop]);
};

// Number.prototype.truncate = function (
//   this: number,
//   suffix: "K" | "M",
//   precision: number = 0,
// ) {
//   const SUFFIX = ["K", "M"];
//   const devisor = 1000 * 1000 ** SUFFIX.indexOf(suffix);
//   const precisionFactor = 10 ** precision;

//   return `${Math.floor((this * precisionFactor) / devisor) / precisionFactor}${suffix}`;
// };

export function divide(value: number, divisor: number, precision: number = 0): number {
  if (Number.isNaN(value)) return value;

  const precisionFactor = 10 ** precision;
  return Math.floor((value * precisionFactor) / divisor) / precisionFactor;
}
