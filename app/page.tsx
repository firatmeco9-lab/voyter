"use client";

import { useState } from "react";
import HeaderNav from "@/components/HeaderNav";
import PollFeed from "@/components/PollFeed";
import BottomBannerAd from "@/components/BottomBannerAd";

type FeedType = "popular" | "latest";

export default function Home() {
  const [feedType, setFeedType] = useState<FeedType>("popular");

  return (
    <main className="min-h-screen text-slate-900">
      <HeaderNav
        feedType={feedType}
        onFeedTypeChange={setFeedType}
      />

      <PollFeed feedType={feedType} />

      <BottomBannerAd />
    </main>
  );
}