import { sendMessage } from "@/api";
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
  addMessage: async (msg: ChatMessage) => {
    try {
      set((state) => ({ messages: [...state.messages, msg] }));

      const res = await sendMessage(msg.sender, msg.message);

      if (res) {
        set((state) => ({
          messages: [...state.messages, { sender: "bot", message: res }],
        }));
      }
    } catch (err) {
      console.warn("Failed to send message:", err);
    }
  },
  clearChat: () => set({ messages: [] }),
}));
