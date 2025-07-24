import type { FileItem } from "@/types";
import { Button } from "../ui/button";
import { FileCheck2, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { useFileStore } from "@/store/file";
import { useChatStore } from "@/store/chat";

const FileCard = ({ file }: { file: FileItem }) => {
  const { clearFile } = useFileStore();
  const { clearChat } = useChatStore();
  const onRemove = (s3Key: string) => {
    clearFile(s3Key);
    clearChat();
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Uploaded File</h3>
      <div className="flex gap-2 items-center justify-between p-4 bg-stone-100 border rounded-xl border-stone-400">
        <div className="text-sm">
          <FileCheck2 />
          <p className="text-black">{file.fileName}</p>
          <p>
            <strong>Uploaded at:</strong> {formatDate(file.createdAt!)}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(file.s3Key)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default FileCard;
