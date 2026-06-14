"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PollCard from "@/components/PollCard";
import { getPolls } from "@/store/pollStore";
import { Poll } from "@/types/poll";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    setPolls(getPolls());
  }, []);

  const filteredPolls = polls.filter((poll) =>
    poll.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        >
          ← Ana Sayfaya Dön
        </Link>

        <div className="mb-6">
          <div className="mb-4 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
            Anket keşfi
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Anket Ara
          </h1>

          <p className="mt-2 text-slate-500">
            Başlığa göre anketleri hızlıca bul.
          </p>
        </div>

        <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Anket başlığı ara..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-6">
          {filteredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}

          {query.length > 0 && filteredPolls.length === 0 && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
              Aradığın anket bulunamadı.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}