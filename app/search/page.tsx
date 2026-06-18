"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PollCard from "@/components/PollCard";
import { getFirestorePolls } from "@/store/firestorePollStore";
import { Poll } from "@/types/poll";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPolls() {
      try {
        const data = await getFirestorePolls();
        setPolls(data);
      } catch (error) {
        console.error("Anketler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPolls();
  }, []);

  const filteredPolls = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return polls;
    }

    return polls.filter((poll) => {
      const title = poll.title?.toLowerCase() || "";
      const category = poll.category?.toLowerCase() || "";
      const slug = poll.slug?.toLowerCase() || "";

      return (
        title.includes(cleanQuery) ||
        category.includes(cleanQuery) ||
        slug.includes(cleanQuery)
      );
    });
  }, [polls, query]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900">
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
            Başlığa veya kategoriye göre anketleri hızlıca bul.
          </p>
        </div>

        <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Örn: Messi, Ronaldo, iPhone, ilişki..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {loading ? (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
            Anketler yükleniyor...
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPolls.map((poll) => (
              <PollCard key={poll.firestoreId || poll.id} poll={poll} />
            ))}

            {filteredPolls.length === 0 && (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
                {query.trim().length > 0
                  ? "Aradığın anket bulunamadı."
                  : "Henüz anket yok."}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}