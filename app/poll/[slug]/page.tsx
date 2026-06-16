import type { Metadata } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PollDetailClient from "@/components/PollDetailClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const snapshot = await getDocs(collection(db, "polls"));

    const poll = snapshot.docs
      .map((doc) => doc.data())
      .find((item) => item.slug === slug);

    if (!poll) {
      return {
        title: "Anket Bulunamadı | Voyter",
        description: "Voyter üzerinde anonim anketlere katıl ve yorumları oku.",
      };
    }

    const title = poll.seoTitle || poll.title || "Voyter Anket";
    const description =
      poll.seoDesc || "Anonim oy ver, yorumları oku ve tartışmaya katıl.";

    return {
      title: `${title} | Voyter`,
      description,
      openGraph: {
        title: `${title} | Voyter`,
        description,
        url: `https://voyter.vercel.app/poll/${slug}`,
        siteName: "Voyter",
        images: poll.imageUrl
          ? [
              {
                url: poll.imageUrl,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Voyter`,
        description,
        images: poll.imageUrl ? [poll.imageUrl] : [],
      },
      alternates: {
        canonical: `https://voyter.vercel.app/poll/${slug}`,
      },
    };
  } catch {
    return {
      title: "Voyter Anket | Voyter",
      description: "Anonim oy ver, yorumları oku ve tartışmaya katıl.",
    };
  }
}

export default function Page() {
  return <PollDetailClient />;
}