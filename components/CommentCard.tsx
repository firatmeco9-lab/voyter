"use client";

import { useEffect, useMemo, useState } from "react";
import { PollComment } from "@/types/poll";

type Props = {
  comment: PollComment;
  onLikeComment: (commentId: number) => void;
};

export default function CommentCard({ comment, onLikeComment }: Props) {
  const storageKey = `voyter_comment_like_${comment.id}`;

  const [liked, setLiked] = useState(false);

  const avatarLetter = useMemo(() => {
    return comment.authorName.charAt(0).toUpperCase();
  }, [comment.authorName]);

  useEffect(() => {
    const savedLike = localStorage.getItem(storageKey);

    if (savedLike === "true") {
      setLiked(true);
    }
  }, [storageKey]);

  function handleLike() {
    if (liked) {
      return;
    }

    localStorage.setItem(storageKey, "true");
    setLiked(true);
    onLikeComment(comment.id);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
          {avatarLetter}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <p className="truncate text-sm font-black text-slate-800">
              {comment.authorName}
            </p>

            <span className="text-xs font-bold text-slate-400">anonim</span>
          </div>

          <p className="break-words text-[15px] leading-relaxed text-slate-700">
            {comment.text}
          </p>

          <button
            onClick={handleLike}
            disabled={liked}
            className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black transition ${
              liked
                ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
            }`}
          >
            <span>{liked ? "❤️" : "👍"}</span>
            <span>{comment.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}