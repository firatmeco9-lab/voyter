import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "@/lib/firebase";

export async function uploadImage(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const storageRef = ref(storage, `poll-images/${fileName}`);

  const snapshot = await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}