export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profilePicture: string | null;
  };
  media: Media[];
  comments: Comment[];
  likes: string[];
  createdAt: string;
}
export interface Media {
  _id: string;
  type: "image" | "video";
  url: string;
}
export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profilePicture: string | null;
  };
  createdAt: string;
}
