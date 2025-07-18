import { cn } from "@/lib/utils";

const Message = ({
  text,
  isMine = false,
}: {
  text: string;
  isMine?: boolean;
}) => {
  return (
    <div
      className={cn("w-full flex", isMine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[70%] px-4 py-2 rounded-2xl shadow-sm",
          isMine
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-muted-foreground rounded-bl-sm"
        )}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;
