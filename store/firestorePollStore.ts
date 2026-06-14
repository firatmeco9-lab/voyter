import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Poll } from "@/types/poll";

const POLLS_COLLECTION = "polls";

export async function getFirestorePolls(): Promise<Poll[]> {
  const querySnapshot = await getDocs(collection(db, POLLS_COLLECTION));

  const polls = querySnapshot.docs.map((document) => {
    const data = document.data();

    return {
      ...data,
      firestoreId: document.id,
    } as unknown as Poll;
  });

  return polls;
}

export async function addFirestorePoll(poll: Poll) {
  const documentReference = await addDoc(collection(db, POLLS_COLLECTION), {
    ...poll,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "active",
  });

  return documentReference.id;
}

export async function updateFirestorePoll(firestoreId: string, poll: Poll) {
  await updateDoc(doc(db, POLLS_COLLECTION, firestoreId), {
    ...poll,
    updatedAt: serverTimestamp(),
  });
}