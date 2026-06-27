"use client";
import {
  addFirestorePoll,
  updateFirestorePoll,
} from "@/store/firestorePollStore";
import { createAnonymousName } from "@/data/anonymousNames";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/uploadImage";
import {
  addPoll,
  deletePoll,
  updatePoll,
} from "@/store/pollStore";
import {
  getSuggestions,
  removeSuggestion,
  SuggestedPoll,
} from "@/store/suggestionStore";
import { Poll } from "@/types/poll";
import { addFirestorePoll } from "@/store/firestorePollStore";

type AdminOption = {
  text: string;
  votes: string;
};

type ActivePanel = "polls" | "create" | "suggestions" | "sponsors";

const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "voyter123";



export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activePanel, setActivePanel] = useState<ActivePanel>("polls");

  const [polls, setPolls] = useState<Poll[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedPoll[]>([]);

  const [editingPollId, setEditingPollId] = useState<number | null>(null);
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Gündem");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [slug, setSlug] = useState("");

  const [options, setOptions] = useState<AdminOption[]>([
    { text: "", votes: "10" },
    { text: "", votes: "10" },
  ]);

  const [comments, setComments] = useState(["", ""]);

  useEffect(() => {
    async function initializeAdmin() {
      const savedLogin = localStorage.getItem("voyter_admin_logged_in");

      if (savedLogin === "true") {
        setIsLoggedIn(true);
        await refreshData();
      }
    }

    initializeAdmin();
  }, []);

  async function refreshData() {
    const snapshot = await getDocs(collection(db, "polls"));

    const firestorePolls = snapshot.docs.map((doc) => ({
      ...(doc.data() as Poll),
    }));

    setPolls(firestorePolls);

    const firestoreSuggestions = await getSuggestions();
    setSuggestions(firestoreSuggestions);
  }

  async function handleLogin() {
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      localStorage.setItem("voyter_admin_logged_in", "true");
      setIsLoggedIn(true);
      setPasswordInput("");
      setLoginError("");
      await refreshData();
      return;
    }

    setLoginError("Şifre yanlış.");
  }

  function handleLogout() {
    localStorage.removeItem("voyter_admin_logged_in");
    setIsLoggedIn(false);
    setPasswordInput("");
    setLoginError("");
  }

  function resetForm() {
    setEditingPollId(null);
    setEditingSuggestionId(null);

    setTitle("");
    setCategory("Gündem");
    setImageUrl("");

    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setSlug("");

    setOptions([
      { text: "", votes: "10" },
      { text: "", votes: "10" },
    ]);

    setComments(["", ""]);
  }

  function openCreatePanel() {
    resetForm();
    setActivePanel("create");
  }

  function loadPollToForm(poll: Poll) {
    setEditingPollId(poll.id);
    setEditingSuggestionId(null);

    setTitle(poll.title);
    setCategory(poll.category);
    setImageUrl(poll.imageUrl || "");

    setSeoTitle(poll.seoTitle || "");
    setSeoDescription(poll.seoDescription || "");
    setSeoKeywords(poll.seoKeywords || "");
    setSlug(poll.slug || "");

    setOptions(
      poll.options.map((option) => ({
        text: option.text,
        votes: String(option.votes),
      }))
    );

    setComments(
      poll.comments.length > 0
        ? poll.comments.map((comment) => comment.text)
        : ["", ""]
    );

    setActivePanel("create");
  }

  function loadSuggestionToForm(suggestion: SuggestedPoll) {
    setEditingPollId(null);
    setEditingSuggestionId(suggestion.id);

    setTitle(suggestion.title);
    setCategory("Gündem");
    setImageUrl("");

    setSeoTitle(suggestion.title);
    setSeoDescription("");
    setSeoKeywords("");
    setSlug("");

    setOptions(
      suggestion.options.map((option) => ({
        text: option,
        votes: "10",
      }))
    );

    setComments(["", ""]);
    setActivePanel("create");
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Lütfen sadece görsel dosyası seç.");
      return;
    }

    try {
      setIsUploadingImage(true);

      const uploadedUrl = await uploadImage(file);
      setImageUrl(uploadedUrl);
    } catch (error) {
      console.error("Görsel yüklenemedi:", error);
      alert("Görsel yüklenemedi. Firebase Storage ayarlarını kontrol et.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function savePollFromForm() {
    const cleanTitle = title.trim();
    const cleanCategory = category.trim() || "Gündem";
    const cleanImageUrl = imageUrl.trim();

    const cleanOptions = options
      .map((option) => ({
        text: option.text.trim(),
        votes: Number(option.votes),
      }))
      .filter((option) => option.text.length > 0);

    const cleanComments = comments
      .map((comment) => comment.trim())
      .filter((comment) => comment.length > 0);

    if (cleanTitle.length < 5 || cleanOptions.length < 2) {
      alert(
        "Anket başlığı en az 5 karakter olmalı ve en az 2 seçenek girmelisin."
      );
      return;
    }

    const pollData: Poll = {
      id: editingPollId ?? Date.now(),
      title: cleanTitle,
      category: cleanCategory,
      imageUrl: cleanImageUrl,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      seoKeywords: seoKeywords.trim(),
      slug: slug.trim(),
      options: cleanOptions.map((option) => ({
        text: option.text,
        votes:
          Number.isFinite(option.votes) && option.votes >= 0
            ? option.votes
            : 0,
      })),
      comments: cleanComments.map((comment, index) => ({
        id: Date.now() + index,
       authorName: createAnonymousName(),
        text: comment,
        likes: 0,
      })),
    };

    if (editingPollId !== null) {
  updatePoll(pollData);

  if (pollData.firestoreId) {
    await updateFirestorePoll(pollData.firestoreId, pollData);
  }

  alert("Anket güncellendi");
} else {
  addPoll(pollData);
  await addFirestorePoll(pollData);
  alert("Anket oluşturuldu");
}

    if (editingSuggestionId !== null) {
      await removeSuggestion(editingSuggestionId);
    }

    resetForm();
    await refreshData();
    setActivePanel("polls");
  }

  async function handleDeletePoll(pollId: number) {
    if (!confirm("Bu anketi silmek istediğine emin misin?")) return;

    deletePoll(pollId);
    await refreshData();

    if (editingPollId === pollId) {
      resetForm();
    }
  }

  async function handleDeleteSuggestion(suggestionId: string) {
    await removeSuggestion(suggestionId);
    await refreshData();

    if (editingSuggestionId === suggestionId) {
      resetForm();
    }
  }

  function handleOptionTextChange(index: number, value: string) {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? { ...option, text: value } : option
      )
    );
  }

  function handleOptionVoteChange(index: number, value: string) {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? { ...option, votes: value } : option
      )
    );
  }

  function handleCommentChange(index: number, value: string) {
    setComments((current) =>
      current.map((comment, commentIndex) =>
        commentIndex === index ? value : comment
      )
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-slate-700/50 bg-slate-900/70 p-6 shadow-2xl">
          <h1 className="text-3xl font-black">Voyter</h1>
          <p className="mt-1 text-sm text-slate-400">Admin girişi</p>

          <div className="mt-6 space-y-4">
            <input
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setLoginError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              type="password"
              placeholder="Admin şifresi"
              className="w-full rounded-2xl border border-slate-700/50 bg-slate-950/60 p-4 outline-none placeholder:text-slate-500"
            />

            {loginError && (
              <p className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm font-bold text-red-300">
                {loginError}
              </p>
            )}

            <button
              onClick={handleLogin}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-sky-400 py-4 font-black text-white"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-700/40 bg-slate-950/50 p-5 backdrop-blur-xl md:border-b-0 md:border-r">
          <div className="flex items-start justify-between gap-4 md:block">
            <div>
              <h1 className="text-3xl font-black">Voyter</h1>
              <p className="mt-1 text-sm text-slate-400">Admin Paneli</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-500/40 px-3 py-2 text-sm font-bold text-red-300 md:mt-4 md:w-full"
            >
              Çıkış
            </button>
          </div>

          <div className="mt-8 space-y-3">
            {[
              ["polls", "Anketler"],
              ["create", "Yeni Anket"],
              ["suggestions", "Öneriler"],
              ["sponsors", "Sponsorlu Reklamlar"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() =>
                  key === "create"
                    ? openCreatePanel()
                    : setActivePanel(key as ActivePanel)
                }
                className={`w-full rounded-2xl px-4 py-4 text-left font-black transition ${
                  activePanel === key
                    ? "bg-gradient-to-r from-violet-500 to-sky-400 text-white"
                    : "border border-slate-700/40 bg-slate-900/50 text-slate-200 hover:bg-slate-800/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        <section className="p-5 md:p-8">
          {activePanel === "polls" && (
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">Anketler</h2>
                  <p className="mt-1 text-slate-400">
                    Yayındaki anketleri düzenle veya sil.
                  </p>
                </div>

                <button
                  onClick={openCreatePanel}
                  className="rounded-2xl bg-gradient-to-r from-violet-500 to-sky-400 px-5 py-3 font-black text-white"
                >
                  Yeni Anket
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {polls.map((poll) => (
                  <div
                    key={poll.id}
                    className="overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900/40"
                  >
                    {poll.imageUrl && (
                      <img
                        src={poll.imageUrl}
                        alt={poll.title}
                        className="h-44 w-full object-cover"
                      />
                    )}

                    <div className="p-5">
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                        {poll.category}
                      </span>

                      <h3 className="mb-4 mt-3 text-xl font-black">
                        {poll.title}
                      </h3>

                      <p className="mb-4 text-sm text-slate-400">
                        {poll.comments.length} yorum
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={() => loadPollToForm(poll)}
                          className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-400 px-4 py-3 font-black text-white"
                        >
                          Düzenle
                        </button>

                        <button
                          onClick={() => handleDeletePoll(poll.id)}
                          className="rounded-xl border border-red-500/50 px-4 py-3 font-bold text-red-300"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePanel === "suggestions" && (
            <div>
              <h2 className="text-3xl font-black">Anket Önerileri</h2>
              <p className="mt-1 text-slate-400">
                Kullanıcı önerilerini düzenleyip ankete çevirebilirsin.
              </p>

              <div className="mt-6 space-y-4">
                {suggestions.length === 0 && (
                  <div className="rounded-3xl border border-slate-700/40 bg-slate-900/40 p-6 text-slate-400">
                    Bekleyen öneri yok.
                  </div>
                )}

                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="rounded-3xl border border-slate-700/40 bg-slate-900/40 p-5"
                  >
                    <h3 className="mb-4 text-xl font-black">
                      {suggestion.title}
                    </h3>

                    <div className="mb-5 flex flex-wrap gap-2">
                      {suggestion.options.map((option, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-slate-700/40 bg-slate-800/60 px-3 py-2 text-sm text-slate-300"
                        >
                          {option}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => loadSuggestionToForm(suggestion)}
                        className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-400 px-4 py-3 font-black text-white"
                      >
                        Düzenle ve Yayınla
                      </button>

                      <button
                        onClick={() => handleDeleteSuggestion(suggestion.id)}
                        className="rounded-xl border border-red-500/50 px-4 py-3 font-bold text-red-300"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePanel === "create" && (
            <div>
              <h2 className="text-3xl font-black">
                {editingPollId
                  ? "Anketi Düzenle"
                  : editingSuggestionId
                  ? "Öneriyi Yayına Hazırla"
                  : "Yeni Anket Oluştur"}
              </h2>

              <p className="mt-1 text-slate-400">
                İçerik, görsel, SEO, seçenek ve başlangıç yorumlarını yönet.
              </p>

              <div className="mt-6 space-y-5 rounded-3xl border border-slate-700/40 bg-slate-900/40 p-6">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Anket başlığı"
                  className="w-full rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 outline-none placeholder:text-slate-500"
                />

                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Kategori"
                  className="w-full rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 outline-none placeholder:text-slate-500"
                />

                <div className="space-y-4 rounded-3xl border border-slate-700/40 bg-slate-950/40 p-4">
                  <h3 className="text-lg font-black">Anket Görseli</h3>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 text-slate-300"
                  />

                  {isUploadingImage && (
                    <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-sm font-bold text-cyan-300">
                      Görsel yükleniyor...
                    </div>
                  )}

                  {imageUrl.trim().length > 0 && (
                    <div className="space-y-3">
                      <img
                        src={imageUrl.trim()}
                        alt="Önizleme"
                        className="h-56 w-full rounded-3xl object-cover"
                      />

                      <input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Görsel URL"
                        className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 outline-none placeholder:text-slate-500"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-slate-700/40 bg-slate-950/40 p-4">
                  <h3 className="mb-4 text-lg font-black">SEO Ayarları</h3>

                  <div className="space-y-4">
                    <input
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="SEO başlığı"
                      className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 outline-none placeholder:text-slate-500"
                    />

                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Meta açıklaması"
                      className="min-h-[100px] w-full resize-none rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 outline-none placeholder:text-slate-500"
                    />

                    <input
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="Anahtar kelimeler"
                      className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 outline-none placeholder:text-slate-500"
                    />

                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="URL slug"
                      className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-700/40 bg-slate-950/40 p-4">
                  <h3 className="mb-4 text-lg font-black">Seçenekler</h3>

                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_110px] gap-3"
                      >
                        <input
                          value={option.text}
                          onChange={(e) =>
                            handleOptionTextChange(index, e.target.value)
                          }
                          placeholder={`${index + 1}. seçenek`}
                          className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 outline-none placeholder:text-slate-500"
                        />

                        <input
                          value={option.votes}
                          onChange={(e) =>
                            handleOptionVoteChange(index, e.target.value)
                          }
                          type="number"
                          min="0"
                          placeholder="Oy"
                          className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 outline-none placeholder:text-slate-500"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setOptions((current) => [
                        ...current,
                        { text: "", votes: "10" },
                      ])
                    }
                    className="mt-4 w-full rounded-2xl border border-cyan-400/40 px-5 py-3 font-bold text-cyan-300"
                  >
                    Seçenek Ekle
                  </button>
                </div>

                <div className="rounded-3xl border border-slate-700/40 bg-slate-950/40 p-4">
                  <h3 className="mb-4 text-lg font-black">
                    Başlangıç Yorumları
                  </h3>

                  <div className="space-y-3">
                    {comments.map((comment, index) => (
                      <textarea
                        key={index}
                        value={comment}
                        onChange={(e) =>
                          handleCommentChange(index, e.target.value)
                        }
                        placeholder={`${index + 1}. yorum`}
                        className="min-h-[90px] w-full resize-none rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 outline-none placeholder:text-slate-500"
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setComments((current) => [...current, ""])}
                    className="mt-4 w-full rounded-2xl border border-violet-400/40 px-5 py-3 font-bold text-violet-300"
                  >
                    Yorum Ekle
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={savePollFromForm}
                    disabled={isUploadingImage}
                    className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-sky-400 py-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUploadingImage
                      ? "Görsel Yükleniyor..."
                      : editingPollId
                      ? "Anketi Güncelle"
                      : editingSuggestionId
                      ? "Düzenle ve Yayınla"
                      : "Anketi Yayınla"}
                  </button>

                  <button
                    onClick={() => {
                      resetForm();
                      setActivePanel("polls");
                    }}
                    className="w-full rounded-2xl border border-slate-700/50 py-4 font-bold text-slate-300"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePanel === "sponsors" && (
            <div>
              <h2 className="text-3xl font-black">Sponsorlu Reklamlar</h2>
              <p className="mt-1 text-slate-400">
                Buraya ileride feed arası ve detay sayfası sponsor reklamları
                gelecek.
              </p>

              <div className="mt-6 rounded-3xl border border-slate-700/40 bg-slate-900/40 p-6">
                <p className="text-slate-400">
                  Şimdilik alanı hazırladık. Bir sonraki adımda sponsor reklam
                  formunu ve kayıt sistemini ekleyeceğiz.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}