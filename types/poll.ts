export type PollOption = {
  text: string;
  votes: number;
};

export type PollComment = {
  id: number;
  authorName: string;
  text: string;
  likes: number;
};

export type Poll = {
  firestoreId?: string;

  id: number;

  title: string;
  category: string;

  imageUrl?: string;

  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  slug?: string;

  options: PollOption[];
  comments: PollComment[];
};