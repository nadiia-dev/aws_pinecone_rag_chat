import { cn } from "@/lib/utils";
import TypingDots from "./TypingDots";

const Message = ({
  text,
  isMine = false,
  isThinking = false,
}: {
  text?: string;
  isMine?: boolean;
  isThinking?: boolean;
}) => {
  const shouldShowTyping = isThinking && !isMine;

  return (
    <div
      className={cn(
        "w-full flex mb-2",
        isMine ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] px-4 py-2 rounded-2xl shadow-sm",
          isMine
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-muted-foreground rounded-bl-sm"
        )}
      >
        {shouldShowTyping ? <TypingDots /> : text}
      </div>
    </div>
  );
};

export default Message;
