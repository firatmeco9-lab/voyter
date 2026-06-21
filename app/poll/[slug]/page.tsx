import type { Metadata } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PollDetailClient from "@/components/PollDetailClient";
import { Poll } from "@/types/poll";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type PollWithSeo = Poll & {
  seoTitle?: string;
  seoDesc?: string;
  keywords?: string[];
};

const SITE_URL = "https://voyter.vercel.app";

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

async function getPollBySlug(slug: string): Promise<PollWithSeo | null> {
  const snapshot = await getDocs(collection(db, "polls"));

  const polls = snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<PollWithSeo, "firestoreId">;

    return {
      ...data,
      firestoreId: doc.id,
    } as PollWithSeo;
  });

  const foundPoll = polls.find((poll) => {
    const pollSlug =
      poll.slug?.trim() || createSlug(poll.title) || String(poll.id);

    return pollSlug === slug || String(poll.id) === slug;
  });

  return foundPoll || null;
}

function getPollStats(poll: PollWithSeo) {
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  const topOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];

  const topPercent =
    totalVotes === 0 || !topOption
      ? 0
      : Math.round((topOption.votes / totalVotes) * 100);

  return {
    totalVotes,
    topOption,
    topPercent,
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const poll = await getPollBySlug(slug);

    if (!poll) {
      return {
        title: "Anket Bulunamadı | Voyter",
        description:
          "Voyter üzerinde anonim anketlere katıl ve yorumları oku.",
      };
    }

    const { totalVotes, topOption, topPercent } = getPollStats(poll);

    const title =
      poll.seoTitle || `${poll.title} | Güncel Anket ve Yorumlar`;

    const description =
      poll.seoDesc ||
      (topOption
        ? `${poll.title} anketinde ${topOption.text} şu anda %${topPercent} oy oranıyla önde. Toplam ${totalVotes} oy kullanıldı. Sen de oy ver ve yorumları oku.`
        : `${poll.title} anketine oy ver, anonim yorumları oku ve tartışmaya katıl.`);

    return {
      title,
      description,
      keywords: poll.keywords || [],
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/poll/${slug}`,
        siteName: "Voyter",
        images: poll.imageUrl
          ? [
              {
                url: poll.imageUrl,
                width: 1200,
                height: 630,
                alt: poll.title,
              },
            ]
          : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: poll.imageUrl ? [poll.imageUrl] : [],
      },
      alternates: {
        canonical: `${SITE_URL}/poll/${slug}`,
      },
    };
  } catch {
    return {
      title: "Voyter Anket",
      description: "Anonim oy ver, yorumları oku ve tartışmaya katıl.",
    };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const poll = await getPollBySlug(slug);

  if (!poll) {
    return (
      <main className="min-h-screen px-4 py-6 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          Anket bulunamadı.
        </div>
      </main>
    );
  }

  const { totalVotes } = getPollStats(poll);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Question",
    name: poll.title,
    text: poll.title,
    answerCount: totalVotes,
    commentCount: poll.comments?.length || 0,
    url: `${SITE_URL}/poll/${slug}`,
    suggestedAnswer: poll.options.map((option) => ({
      "@type": "Answer",
      text: option.text,
      upvoteCount: option.votes,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <PollDetailClient initialPoll={poll} />
    </>
  );
}