"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CommentCard from "@/components/CommentCard";
import CommentInput from "@/components/CommentInput";
import { getAnonymousName } from "@/lib/getAnonymousName";
import {
  getFirestorePolls,
  updateFirestorePoll,
} from "@/store/firestorePollStore";
import { Poll } from "@/types/poll";

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

export default function PollDetailClient() {
  const params = useParams();
  const slug = String(params.slug);

  const [poll, setPoll] = useState<Poll | null>(null);
  const [comments, setComments] = useState<Poll["comments"]>([]);
  const [options, setOptions] = useState<Poll["options"]>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadPoll() {
      try {
        const firestorePolls = await getFirestorePolls();

        const foundPoll = firestorePolls.find((item) => {
          const itemSlug =
            item.slug?.trim() || createSlug(item.title) || String(item.id);

          return itemSlug === slug || String(item.id) === slug;
        });

        if (!foundPoll) {
          return;
        }

        setPoll(foundPoll);
        setComments(foundPoll.comments || []);
        setOptions(foundPoll.options || []);

        const savedVote = localStorage.getItem(`voyter_vote_${foundPoll.id}`);

        if (savedVote !== null) {
          setSelectedOptionIndex(Number(savedVote));
        }
      } catch (error) {
        console.error("Firestore anket detayı yüklenemedi:", error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadPoll();
  }, [slug]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen px-4 py-6 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
          Anket yükleniyor...
        </div>
      </main>
    );
  }

  if (!poll) {
    return (
      <main className="min-h-screen px-4 py-6 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          Anket bulunamadı.
        </div>
      </main>
    );
  }

  const pollId = poll.id;
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  const categoryStyle = getCategoryStyle(poll.category);

  async function handleAddComment(commentText: string) {
    if (!poll || !poll.firestoreId) {
      return;
    }

    const newComment = {
      id: Date.now(),
      authorName: getAnonymousName(),
      text: commentText,
      likes: 0,
    };

    const updatedComments = [newComment, ...comments];

    setComments(updatedComments);

    const updatedPoll = {
      ...poll,
      comments: updatedComments,
      options,
    };

    setPoll(updatedPoll);

    await updateFirestorePoll(poll.firestoreId, updatedPoll);
  }

  async function handleLikeComment(commentId: number) {
    if (!poll || !poll.firestoreId) {
      return;
    }

    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            likes: comment.likes + 1,
          }
        : comment
    );

    setComments(updatedComments);

    const updatedPoll = {
      ...poll,
      comments: updatedComments,
      options,
    };

    setPoll(updatedPoll);

    await updateFirestorePoll(poll.firestoreId, updatedPoll);
  }

  async function handleVote(optionIndex: number) {
    if (!poll || !poll.firestoreId || selectedOptionIndex !== null) {
      return;
    }

    localStorage.setItem(`voyter_vote_${pollId}`, String(optionIndex));
    setSelectedOptionIndex(optionIndex);

    const updatedOptions = options.map((option, index) =>
      index === optionIndex
        ? {
            ...option,
            votes: option.votes + 1,
          }
        : option
    );

    setOptions(updatedOptions);

    const updatedPoll = {
      ...poll,
      options: updatedOptions,
      comments,
    };

    setPoll(updatedPoll);

    await updateFirestorePoll(poll.firestoreId, updatedPoll);
  }

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        >
          ← Geri Dön
        </Link>

        <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          {poll.imageUrl && (
            <img
              src={poll.imageUrl}
              alt={poll.title}
              className="h-72 w-full object-cover md:h-[420px]"
            />
          )}

          <div className="p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black ${categoryStyle}`}
              >
                {poll.category}
              </span>

              <span className="text-sm font-bold text-slate-500">
                {comments.length} yorum
              </span>
            </div>

            <div className="mb-4 flex items-center gap-3 text-sm font-bold text-slate-500">
              <span>📊 {totalVotes} oy</span>
              <span>•</span>
              <span>💬 {comments.length} yorum</span>
            </div>

            <h1 className="mb-6 text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">
              {poll.title}
            </h1>

            <div className="space-y-3">
              {options.map((option, index) => {
                const percent =
                  totalVotes === 0
                    ? 0
                    : Math.round((option.votes / totalVotes) * 100);

                const isSelected = selectedOptionIndex === index;
                const hasVoted = selectedOptionIndex !== null;

                return (
                  <button
                    key={index}
                    onClick={() => handleVote(index)}
                    disabled={hasVoted}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="font-bold text-slate-800">
                        {option.text}
                      </span>

                      <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 shadow-sm">
                        %{percent}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {isSelected && (
                      <p className="mt-3 text-sm font-black text-indigo-600">
                        Oyun kaydedildi
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </article>

        <section className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <CommentInput onAddComment={handleAddComment} />

          <div className="mb-5 mt-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Yorumlar</h2>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
              {comments.length} yorum
            </span>
          </div>

          <div className="space-y-4">
            {comments.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                İlk yorumu sen yap.
              </div>
            )}

            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onLikeComment={handleLikeComment}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}