//https://github.com/indiflex/kc5/blob/develop/ts/tt_utility_types.ts

import { useRef } from "react";

export const useDebounce = <
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(
  cb: T,
  delay: number,
) => {
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  return (...args: Parameters<T>) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

/* 
 답지
*/
// export const _useDebounce = <
//   T extends (...args: Parameters<T>) => ReturnType<T>,
// >(
//   cb: T,
//   delay: number,
//   depArr: unknown[] = [],
//   ...args: Parameters<T>
// ) => {
//   const { reset } = useTimeout(() => cb(...args), delay, depArr);
//   useEffect(reset, depArr);
// };

// export const useTimeout = <T extends (...args: Parameters<T>) => ReturnType<T>>(
//   cb: T,
//   delay: number,
//   depArr: unknown[] = [],
//   ...args: Parameters<T>
// ) => {
//   const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

//   const setTheTimer = useCallback(() => {
//     timerRef.current = setTimeout(() => {
//       cb(...args);
//     }, delay);
//   }, depArr);

//   const clear = useCallback(() => clearTimeout(timerRef.current), depArr);

//   const reset = useCallback(() => {
//     clear();
//     setTheTimer();
//   }, depArr);

//   useEffect(() => {
//     setTheTimer();

//     return clear;
//   }, [cb, delay, ...args]);
//   return { reset, clear, ref: timerRef.current };
// };
