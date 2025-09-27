import { Comment } from "./comment";

export interface Post {
  id: string;
  author: string;
  content: string;
  media?: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}