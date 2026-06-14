import { db } from "@/lib/firebase";
import { initialPolls } from "@/data/initialPolls";
import { Poll } from "@/types/poll";

const STORAGE_KEY = "voyter_polls";

export function getPolls(): Poll[] {
  if (typeof window === "undefined") {
    return initialPolls;
  }

  const savedPolls = localStorage.getItem(STORAGE_KEY);

  if (!savedPolls) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPolls));
    return initialPolls;
  }

  return JSON.parse(savedPolls);
}

export function savePolls(polls: Poll[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
}

export function addPoll(poll: Poll) {
  const currentPolls = getPolls();
  const newPolls = [poll, ...currentPolls];

  savePolls(newPolls);

  return newPolls;
}

export function updatePoll(updatedPoll: Poll) {
  const currentPolls = getPolls();

  const updatedPolls = currentPolls.map((poll) =>
    poll.id === updatedPoll.id ? updatedPoll : poll
  );

  savePolls(updatedPolls);

  return updatedPolls;
}

export function deletePoll(pollId: number) {
  const currentPolls = getPolls();

  const updatedPolls = currentPolls.filter((poll) => poll.id !== pollId);

  savePolls(updatedPolls);

  return updatedPolls;
}