"use client";

import {
  likesAndReportsWithFollows,
  toggleFollowBooks,
  toggleLikesOrReportMark,
} from "@/app/bookcase/[id]/book.action";
import type { MarkAllColumn } from "@/lib/db";
import { useSession } from "next-auth/react";
import {
  createContext,
  type PropsWithChildren,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

type ContextValueProps = {
  iLikedMarks: number[];
  iReportedMarks: number[];
  iFollowedBooks: number[];
  toggleLikes: (mark: MarkAllColumn) => void;
  toggleReports: (mark: MarkAllColumn) => void;
  toggleFollows: (book: number) => void;
  // setMarks: (likes: number[], reports: number[]) => void;
};

const StoreContext = createContext<ContextValueProps>({
  iLikedMarks: [],
  iReportedMarks: [],
  iFollowedBooks: [],
  toggleLikes: () => {},
  toggleReports: () => {},
  toggleFollows: () => {},
  // setMarks: () => {},
});

export function StoreProvider({ children }: PropsWithChildren) {
  const [iLikedMarks, setLikedMarks] = useState<number[]>([]);
  const [iReportedMarks, setRepotedMarks] = useState<number[]>([]);
  const [iFollowedBooks, setFollowedBooks] = useState<number[]>([]);
  const { data: session } = useSession();

  const setMarks = useCallback((likes: number[], reports: number[]) => {
    // console.log('🚀 ~ likes/reports:', likes, reports);

    setLikedMarks(likes);
    setRepotedMarks(reports);
  }, []);

  const setFollows = useCallback((follows: number[]) => {
    setFollowedBooks(follows);
  }, []);

  const toggleLikesOrReports = async (mark: MarkAllColumn, type: "likes" | "reports") => {
    const [state, setState] =
      type === "likes" ? [iLikedMarks, setLikedMarks] : [iReportedMarks, setRepotedMarks];

    const hasNow = state.includes(mark.id);
    await toggleLikesOrReportMark(mark.id, type);
    // if (type === "likes") mark._count.Likes += hasNow ? -1 : 1;
    // else mark._count.Report += hasNow ? -1 : 1;

    if (hasNow) setState(state.filter((id) => id !== mark.id));
    else setState([...state, mark.id]);
  };

  const toggleLikes = (mark: MarkAllColumn) => toggleLikesOrReports(mark, "likes");
  const toggleReports = (mark: MarkAllColumn) => toggleLikesOrReports(mark, "reports");
  const toggleFollows = async (book: number) => {
    const hasNow = iFollowedBooks.includes(book);
    await toggleFollowBooks(book);

    if (hasNow) setFollowedBooks(iFollowedBooks.filter((id) => id !== book));
    else setFollowedBooks([...iFollowedBooks, book]);
  };

  useEffect(() => {
    if (session?.user) {
      likesAndReportsWithFollows(Number(session.user.id)).then((res) => {
        // [ [{id: 1}, {id: 2}], [{id: 1}] ]
        const [likes, reports, ifollows] = res;
        setMarks(
          likes.map(({ mark }) => mark),
          reports.map(({ mark }) => mark),
        );

        setFollows(ifollows.mapBy("book"));
      });
    }
  }, [session?.user, setMarks, setFollows]);

  return (
    <StoreContext.Provider
      value={{
        iLikedMarks,
        iReportedMarks,
        iFollowedBooks,
        toggleLikes,
        toggleReports,
        toggleFollows,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => use(StoreContext);
