import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://voyter.vercel.app"),

  title: {
    default: "Voyter - Trend Gündem Anketleri ve Anonim Yorumlar",
    template: "%s | Voyter",
  },

  description:
    "Voyter'da gündem anketlerine oy ver, anonim yorumları oku ve popüler tartışmaları keşfet. Spor, teknoloji, film, ilişki ve sosyal gündem anketleri burada.",

  keywords: [
    "anket",
    "gündem anketleri",
    "trend anketler",
    "anonim yorum",
    "oy verme",
    "popüler anketler",
    "spor anketleri",
    "film anketleri",
    "teknoloji anketleri",
    "ilişki anketleri",
    "karşılaştırma anketleri",
    "voyter",
  ],

  openGraph: {
    title: "Voyter - Trend Gündem Anketleri ve Anonim Yorumlar",
    description:
      "Gündem anketlerine oy ver, anonim yorumları keşfet ve popüler tartışmaları takip et.",
    url: "https://voyter.vercel.app",
    siteName: "Voyter",
    locale: "tr_TR",
    type: "website",
  },

  alternates: {
    canonical: "https://voyter.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}