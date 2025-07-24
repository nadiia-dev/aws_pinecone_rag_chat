import { sendMessage } from "@/api";
import { toast } from "sonner";
import { create } from "zustand";

type ChatMessage = {
  sender: "user" | "bot";
  message: string;
};

export type WithThinking = ChatMessage & {
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
      set((state) => ({
        messages: [
          ...state.messages,
          msg,
          { sender: "bot", message: "", isThinking: true } as WithThinking,
        ],
        typing: true,
      }));

      const res = await sendMessage(msg.sender, msg.message);

      set((state) => {
        const messages = [...state.messages];
        let lastThinkingIndex = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
          if (
            messages[i].sender === "bot" &&
            (messages[i] as WithThinking).isThinking
          ) {
            lastThinkingIndex = i;
            break;
          }
        }

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
