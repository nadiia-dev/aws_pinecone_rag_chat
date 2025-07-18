import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bot, Send } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const ChatWindow = () => {
  const messages = [];
  const onSubmit = () => {};
  return (
    <div className="flex flex-col h-screen w-full p-4">
      <header className="shrink-0 w-full flex flex-row p-2 gap-4 items-center border-b border-stone-400 mb-2">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="p-2 flex justify-center items-center">
            <Bot />
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold">AI Assistant</p>
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
          className="p-1 w-full border-none hover:outline-none focus:outline-none active:outline-none shadow-none"
        />
        <Button variant="ghost" className="bg-transparent" size="icon">
          <Send />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
