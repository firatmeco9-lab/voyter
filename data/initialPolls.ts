import { Poll } from "@/types/poll";

export const initialPolls: Poll[] = [
  {
    id: 1,
    title: "Anonimlik internette gerekli mi?",
    category: "Gündem",

    options: [
      { text: "Evet gerekli", votes: 90 },
      { text: "Hayır kaldırılmalı", votes: 40 },
    ],

    comments: [
      {
        id: 1001,
        authorName: "TRK265",
        text: "merhaba",
        likes: 0,
      },
      {
        id: 1002,
        authorName: "34ANK99",
        text: "Bence anonimlik dürüstlükten çok kontrolsüzlük getiriyor.",
        likes: 0,
      },
      {
        id: 1003,
        authorName: "Q7TDI",
        text: "Gerçek fikirler genelde anonimken ortaya çıkıyor.",
        likes: 0,
      },
    ],
  },

  {
    id: 2,
    title: "İlişkide en büyük kırmızı bayrak hangisi?",
    category: "İlişkiler",

    options: [
      { text: "Sürekli yalan söylemesi", votes: 203 },
      { text: "Aşırı kıskançlık", votes: 176 },
      { text: "İlgisizlik", votes: 91 },
    ],

    comments: [
      {
        id: 2001,
        authorName: "RSLine",
        text: "Yalan varsa güven bitmiştir.",
        likes: 0,
      },
      {
        id: 2002,
        authorName: "1453X",
        text: "Kıskançlık zamanla boğuyor.",
        likes: 0,
      },
    ],
  },
];