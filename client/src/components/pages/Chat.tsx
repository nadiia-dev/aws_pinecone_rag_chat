import { useAuthStore } from "@/store/auth";
import ChatWindow from "../ChatWindow";
import FileBlock from "../FileBlock";
import { useEffect } from "react";
import { useFileStore } from "@/store/file";

const Chat = () => {
  const { email } = useAuthStore();
  const { fetchFile } = useFileStore();

  useEffect(() => {
    if (!email) return;
    fetchFile(email);
  }, [email, fetchFile]);

  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <FileBlock />
      <ChatWindow />
    </div>
  );
};

export default Chat;
