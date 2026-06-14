"use client";

import Link from "next/link";
import { Poll } from "@/types/poll";

type Props = {
  poll: Poll;
};

function getCategoryStyle(category: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("ilişki")) {
    return "bg-pink-50 text-pink-700 border-pink-200";
  }

  if (normalizedCategory.includes("futbol")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalizedCategory.includes("mizah")) {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }

  if (normalizedCategory.includes("teknoloji")) {
    return "bg-cyan-50 text-cyan-700 border-cyan-200";
  }

  return "bg-indigo-50 text-indigo-700 border-indigo-200";
}

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PollCard({ poll }: Props) {
  const pollSlug =
    poll.slug?.trim() || createSlug(poll.title) || String(poll.id);

  const pollUrl = `/poll/${pollSlug}`;

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  const topOptions = poll.options.slice(0, 3);
  const categoryStyle = getCategoryStyle(poll.category);

  return (
    <div className="rounded-[2rem] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 p-[2px] shadow-sm">
      <article className="overflow-hidden rounded-[1.9rem] bg-white transition hover:-translate-y-0.5">
        {poll.imageUrl && (
          <Link href={pollUrl} className="block">
            <img
              src={poll.imageUrl}
              alt={poll.title}
              className="h-52 w-full object-cover md:h-64"
            />
          </Link>
        )}

        <div className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-black ${categoryStyle}`}
            >
              {poll.category}
            </span>

            <span className="text-xs font-bold text-slate-500">
              {poll.comments.length} yorum
            </span>
          </div>

          <Link href={pollUrl}>
            <h2 className="text-2xl font-black leading-tight text-slate-900 transition hover:text-violet-600">
              {poll.title}
            </h2>
          </Link>

          <div className="mt-4 space-y-2">
            {topOptions.map((option, index) => {
              const percent =
                totalVotes === 0
                  ? 0
                  : Math.round((option.votes / totalVotes) * 100);

              return (
                <div key={index}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
                    <span className="truncate">{option.text}</span>
                    <span className="shrink-0">%{percent}</span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-950 transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <div className="rounded-full bg-slate-100 px-2.5 py-1">
                {poll.comments.length} yorum
              </div>

              <div className="rounded-full bg-slate-100 px-2.5 py-1">
                {totalVotes} oy
              </div>
            </div>

            <Link
              href={pollUrl}
              className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
            >
              Oy Ver
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}