import HomeClient from "@/components/HomeClient";
import { getFirestorePolls } from "@/store/firestorePollStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const polls = await getFirestorePolls();

  return <HomeClient initialPolls={polls} />;
}