export type AuthMode = "login" | "signup";

export type Document = {
  id: number;
  title: string;
  content: string;
};

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};
