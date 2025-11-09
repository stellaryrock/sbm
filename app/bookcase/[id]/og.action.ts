"use server";

import ogs from "open-graph-scraper";

export const scrapOg = async (url: string) => {
  // const data = await ogs({ url });
  // console.log("🚀 ~ scrap ~ data:", data);

  const { result } = await ogs({ url });
  console.log("🚀 ~ scrapOg ~ result:", result);
  return result;
};
