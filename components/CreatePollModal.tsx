"use client";

export default function CreatePollModal() {
  return (
    <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6">
      <h2 className="mb-6 text-2xl font-black text-white">
        Yeni Anket Oluştur
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Anket başlığı..."
          className="w-full rounded-2xl border border-white/10 bg-neutral-900 p-4 text-white outline-none"
        />

        <input
          type="text"
          placeholder="Kategori..."
          className="w-full rounded-2xl border border-white/10 bg-neutral-900 p-4 text-white outline-none"
        />

        <input
          type="text"
          placeholder="1. seçenek..."
          className="w-full rounded-2xl border border-white/10 bg-neutral-900 p-4 text-white outline-none"
        />

        <input
          type="text"
          placeholder="2. seçenek..."
          className="w-full rounded-2xl border border-white/10 bg-neutral-900 p-4 text-white outline-none"
        />

        <button className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-500">
          Anket Oluştur
        </button>
      </div>
    </div>
  );
}