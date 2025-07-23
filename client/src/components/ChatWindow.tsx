import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bot, Send } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useChatStore } from "@/store/chat";
import type React from "react";
import { useFileStore } from "@/store/file";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchStatus } from "@/api";
import { useEffect, useState } from "react";

const ChatWindow = () => {
  const { logoutUser } = useAuthStore();
  const { messages, addMessage } = useChatStore();
  const { file } = useFileStore();
  const [enabled, setEnabled] = useState(true);

  const fileId = file?.id;
  const { data } = useQuery({
    queryKey: ["fileStatus", fileId],
    queryFn: () => fetchStatus(fileId!),
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    enabled: enabled && !!file,
  });

  useEffect(() => {
    if (data === "SUCCESS") {
      setEnabled(false);
    }
  }, [data]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = (
      e.currentTarget.elements.namedItem("message") as HTMLInputElement
    ).value;
    addMessage({ sender: "user", message });
    e.currentTarget.reset();
  };

  const isDisabled = data !== "SUCCESS";

  return (
    <div className="flex flex-col h-screen w-full p-4">
      <header className="shrink-0 flex flex-row justify-between items-center w-full border-b border-stone-400 mb-2">
        <div className="flex flex-row p-2 gap-4 items-center">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="p-2 flex justify-center items-center">
              <Bot />
            </AvatarFallback>
          </Avatar>
          <p className="font-semibold">AI Assistant</p>
        </div>
        <Button variant="secondary" onClick={logoutUser}>
          Log out
        </Button>
      </header>
      <ScrollArea className="relative grow min-h-0 px-4 pb-4">
        {messages.length === 0 ? (
          <p className="text-stone-400 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            Start a conversation
          </p>
        ) : (
          <div></div>
        )}
      </ScrollArea>

      <form
        onSubmit={onSubmit}
        className="shrink-0 w-full flex gap-1 border rounded-2xl p-2"
      >
        <Input
          placeholder="Tell something..."
          type="text"
          name="message"
          className="p-1 w-full border-none hover:outline-none focus:outline-none active:outline-none shadow-none"
          disabled={isDisabled}
        />
        <Button
          variant="ghost"
          className="bg-transparent"
          size="icon"
          disabled={isDisabled}
        >
          <Send />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
