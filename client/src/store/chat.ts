import { create } from "zustand";

type ChatMessage = {
  sender: "user" | "bot";
  message: string;
};

type ChatStore = {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearChat: () => set({ messages: [] }),
}));
