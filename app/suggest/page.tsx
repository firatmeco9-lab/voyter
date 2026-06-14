"use client";

import { useState } from "react";
import Link from "next/link";
import { addSuggestion } from "@/store/suggestionStore";

export default function SuggestPollPage() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOptionChange(index: number, value: string) {
    setOptions((currentOptions) =>
      currentOptions.map((option, optionIndex) =>
        optionIndex === index ? value : option
      )
    );
  }

  function handleAddOption() {
    setOptions((currentOptions) => [...currentOptions, ""]);
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    const cleanTitle = title.trim();

    const cleanOptions = options
      .map((option) => option.trim())
      .filter((option) => option.length > 0);

    if (cleanTitle.length < 5 || cleanOptions.length < 2) {
      alert("Anket başlığı ve en az 2 seçenek gir.");
      return;
    }

    try {
      setIsSubmitting(true);

      await addSuggestion({
        title: cleanTitle,
        options: cleanOptions,
      });

      alert("Anket önerin alındı. Admin onayından sonra yayınlanacak.");

      setTitle("");
      setOptions(["", ""]);
    } catch (error) {
      console.error("Öneri gönderilirken hata oluştu:", error);
      alert("Öneri gönderilemedi. Firestore bağlantısını kontrol et.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        >
          ← Ana Sayfaya Dön
        </Link>

        <div className="mb-7">
          <div className="mb-4 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
            Kullanıcı önerisi
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Anket Öner
          </h1>

          <p className="mt-2 text-slate-500">
            Önerilen anketler admin onayından sonra yayınlanır.
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Anket başlığı"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            {options.map((option, index) => (
              <input
                key={index}
                value={option}
                onChange={(event) =>
                  handleOptionChange(index, event.target.value)
                }
                placeholder={`${index + 1}. seçenek`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            ))}

            <button
              onClick={handleAddOption}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 font-black text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Seçenek Ekle
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-indigo-600 py-4 font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Gönderiliyor..." : "Öneriyi Gönder"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}