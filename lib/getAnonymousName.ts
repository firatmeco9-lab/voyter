import { createAnonymousName } from "@/data/anonymousNames";

const STORAGE_KEY = "voyter_anonymous_name";

export function getAnonymousName() {
  if (typeof window === "undefined") {
    return "Anonim";
  }

  const savedName = localStorage.getItem(STORAGE_KEY);

  if (savedName) {
    return savedName;
  }

  const newName = createAnonymousName();

  localStorage.setItem(STORAGE_KEY, newName);

  return newName;
}