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
      <HeaderNav
        feedType={feedType}
        onFeedTypeChange={setFeedType}
      />

      <section className="mx-auto max-w-3xl px-4 pt-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">
            Trend Gündem Anketleri ve Anonim Yorumlar
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Voyter'da spor, teknoloji, film, ilişki ve sosyal gündem
            anketlerine oy verebilir, anonim yorumları okuyabilir ve
            popüler tartışmaları keşfedebilirsin.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/search"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white"
            >
              Anket Ara
            </a>

            <a
              href="/suggest"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
            >
              Anket Öner
            </a>
          </div>
        </div>
      </section>

      <PollFeed
        feedType={feedType}
        initialPolls={initialPolls}
      />

      <BottomBannerAd />
    </main>
  );
}