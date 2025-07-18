import ChatWindow from "../ChatWindow";
import FileCard from "../FileCard";
import FileInput from "../FileInput";

const Chat = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <aside className="w-full xl:w-[400px] divider">
        <FileCard />
        <FileInput />
      </aside>
      <ChatWindow />
    </div>
  );
};

export default Chat;
