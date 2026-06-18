"use client";

import { useEffect, useMemo, useState } from "react";
import PollCard from "@/components/PollCard";
import AdBox from "@/components/AdBox";
import { Poll } from "@/types/poll";

type FeedType = "popular" | "latest";

type Props = {
  feedType: FeedType;
  initialPolls: Poll[];
};

const PAGE_SIZE = 5;

export default function PollFeed({ feedType, initialPolls }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [feedType]);

  const sortedPolls = useMemo(() => {
    const clonedPolls = [...initialPolls];

    if (feedType === "latest") {
      return clonedPolls.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return clonedPolls.sort((a, b) => {
      const totalVotesA = a.options.reduce(
        (sum, option) => sum + option.votes,
        0
      );

      const totalVotesB = b.options.reduce(
        (sum, option) => sum + option.votes,
        0
      );

      const scoreA = totalVotesA + a.comments.length * 15;
      const scoreB = totalVotesB + b.comments.length * 15;

      return scoreB - scoreA;
    });
  }, [initialPolls, feedType]);

  const visiblePolls = sortedPolls.slice(0, visibleCount);
  const hasMorePolls = visibleCount < sortedPolls.length;

  if (visiblePolls.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
          Henüz anket yok.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {visiblePolls.map((poll, index) => (
        <div key={poll.firestoreId || poll.id}>
          <PollCard poll={poll} />

          {(index + 1) % 3 === 0 && <AdBox />}
        </div>
      ))}

      {hasMorePolls && (
        <button
          onClick={() =>
            setVisibleCount((currentCount) => currentCount + PAGE_SIZE)
          }
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-black text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        >
          Daha Fazla Göster
        </button>
      )}
    </section>
  );
}