import { sendMessage } from "@/api";
import { toast } from "sonner";
import { create } from "zustand";

type ChatMessage = {
  sender: "user" | "bot";
  message: string;
};

type WithThinking = ChatMessage & {
  isThinking?: boolean;
};

type ChatStore = {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  typing: boolean;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: async (msg: ChatMessage) => {
    try {
      set((state) => ({ messages: [...state.messages, msg], typing: false }));

      set((state) => ({
        messages: [
          ...state.messages,
          { sender: "bot", message: "", isThinking: true } as WithThinking,
        ],
        typing: true,
      }));

      const res = await sendMessage(msg.sender, msg.message);

      set((state) => {
        const messages = [...state.messages];
        const lastThinkingIndex = messages.findIndex(
          (m) => m.sender === "bot" && (m as WithThinking).isThinking
        );

        if (lastThinkingIndex !== -1) {
          messages[lastThinkingIndex] = { sender: "bot", message: res! };
        }

        return {
          messages,
          typing: false,
        };
      });
    } catch (err) {
      console.warn("Failed to send message:", err);
      toast.error("Failed to send message");
      set({ typing: false });
    }
  },
  clearChat: () => set({ messages: [] }),
  typing: false,
}));
