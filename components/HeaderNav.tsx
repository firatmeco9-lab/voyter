"use client";

import Link from "next/link";

type FeedType = "popular" | "latest";

type Props = {
  feedType: FeedType;
  onFeedTypeChange: (feedType: FeedType) => void;
};

export default function HeaderNav({
  feedType,
  onFeedTypeChange,
}: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-4 md:py-5">
        <div className="mb-4 flex items-center justify-between gap-4 md:mb-5">
          <Link href="/">
            <div className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 shadow-sm md:h-11 md:w-11">
                <span className="text-base font-black text-white md:text-lg">
                  V
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 transition group-hover:text-indigo-600 md:text-3xl">
                  Voyter
                </h1>

                <p className="text-xs text-slate-500 md:text-sm">
                  Oy ver, yorumları oku, gündemi yakala.
                </p>
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-sm font-medium text-slate-500">
              Canlı gündem
            </span>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            onClick={() => onFeedTypeChange("popular")}
            className={`rounded-2xl px-3 py-2.5 text-sm font-black transition md:px-4 md:py-3 ${
              feedType === "popular"
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            Popüler
          </button>

          <button
            onClick={() => onFeedTypeChange("latest")}
            className={`rounded-2xl px-3 py-2.5 text-sm font-black transition md:px-4 md:py-3 ${
              feedType === "latest"
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            Güncel
          </button>

          <Link
            href="/search"
            className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-black text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 md:px-4 md:py-3"
          >
            Anket Ara
          </Link>

          <Link
            href="/suggest"
            className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-black text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 md:px-4 md:py-3"
          >
            Anket Öner
          </Link>
        </nav>
      </div>
    </header>
  );
}