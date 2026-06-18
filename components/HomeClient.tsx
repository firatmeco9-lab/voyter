"use client";

import { useState } from "react";
import HeaderNav from "@/components/HeaderNav";
import PollFeed from "@/components/PollFeed";
import BottomBannerAd from "@/components/BottomBannerAd";
import { Poll } from "@/types/poll";

type FeedType = "popular" | "latest";

type Props = {
  initialPolls: Poll[];
};

export default function HomeClient({ initialPolls }: Props) {
  const [feedType, setFeedType] = useState<FeedType>("latest");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <HeaderNav feedType={feedType} onFeedTypeChange={setFeedType} />

      <PollFeed feedType={feedType} initialPolls={initialPolls} />

      <BottomBannerAd />
    </main>
  );
}