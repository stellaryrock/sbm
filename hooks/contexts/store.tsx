"use client";

import { likesAndReports } from "@/app/bookcase/[id]/book.action";
import { useSession } from "next-auth/react";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type StoreContextValueProps = {
  iLikedMarks: number[];
  iReportedMarks: number[];
  // setMarks: (likes: number[], reports: number[]) => void;
};

const StoreContext = createContext<StoreContextValueProps>({
  iLikedMarks: [],
  iReportedMarks: [],
  //  setMarks: () => {},
});

export function StoreProvider({ children }: PropsWithChildren) {
  const [iLikedMarks, setLikedMarks] = useState<number[]>([]);
  const [iReportedMarks, setReportedMarks] = useState<number[]>([]);
  const { data: session } = useSession();

  const setMarks = useCallback((likes: number[], reports: number[]) => {
    setLikedMarks(likes);
    setReportedMarks(reports);
  }, []);

  useEffect(() => {
    if (session?.user) {
      console.log("🚀 ~ StoreProvider ~ user:", session.user);

      likesAndReports(Number(session.user.id)).then((res) => {
        const [likes, reports] = res;
        setMarks(
          likes.map(({ mark }) => mark),
          reports.map(({ mark }) => mark),
        );
      });
    }
  }, [session?.user, setMarks]);

  return (
    <StoreContext.Provider value={{ iLikedMarks, iReportedMarks }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => use(StoreContext);
