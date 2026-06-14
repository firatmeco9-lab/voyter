"use client";

import { useState } from "react";

type Props = {
  onAddComment: (comment: string) => void;
};

export default function CommentInput({ onAddComment }: Props) {
  const [text, setText] = useState("");

  const characterCount = text.trim().length;
  const canSubmit = characterCount >= 2;

  function handleSubmit() {
    const cleanText = text.trim();

    if (cleanText.length < 2) {
      return;
    }

    onAddComment(cleanText);
    setText("");
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-900">
            Yorum Yap
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Fikrini anonim olarak paylaş.
          </p>
        </div>

        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
          anonim
        </span>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Fikrini anonim olarak yaz..."
        className="min-h-[110px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-[15px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-400">
          {characterCount} karakter
        </span>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Yorumu Gönder
        </button>
      </div>
    </div>
  );
}