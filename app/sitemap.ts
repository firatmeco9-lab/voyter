import { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://voyter.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },

    {
      url: `${baseUrl}/suggest`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  try {
    const snapshot = await getDocs(collection(db, "polls"));

    const pollPages: MetadataRoute.Sitemap = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        url: `${baseUrl}/poll/${data.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      };
    });

    return [...staticPages, ...pollPages];
  } catch (error) {
    console.error("Sitemap error:", error);

    return staticPages;
  }
}