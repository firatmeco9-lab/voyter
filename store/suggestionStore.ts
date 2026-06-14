import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SuggestedPoll = {
  id: string;
  title: string;
  options: string[];
  createdAt?: unknown;
};

const SUGGESTIONS_COLLECTION = "suggestedPolls";

export async function getSuggestions(): Promise<SuggestedPoll[]> {
  const suggestionsQuery = query(
    collection(db, SUGGESTIONS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(suggestionsQuery);

  return snapshot.docs.map((docItem) => {
    const data = docItem.data();

    return {
      id: docItem.id,
      title: String(data.title || ""),
      options: Array.isArray(data.options) ? data.options : [],
      createdAt: data.createdAt,
    };
  });
}

export async function addSuggestion(suggestion: {
  title: string;
  options: string[];
}) {
  await addDoc(collection(db, SUGGESTIONS_COLLECTION), {
    title: suggestion.title,
    options: suggestion.options,
    createdAt: serverTimestamp(),
  });
}

export async function removeSuggestion(id: string) {
  await deleteDoc(doc(db, SUGGESTIONS_COLLECTION, id));
}