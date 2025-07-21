import type { FileItem } from "@/types";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { useFileStore } from "@/store/file";

const FileCard = ({ file }: { file: FileItem }) => {
  const { clearFile } = useFileStore();
  const onRemove = (id: string) => {
    clearFile(id);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Uploaded File</h3>
      <div className="flex gap-2 items-center justify-between p-4 bg-stone-100 border rounded-xl border-stone-400">
        <div className="text-sm">
          <p className="text-black">
            <strong>Name:</strong> {file.fileName}
          </p>
          <p>
            <strong>Uploaded at:</strong> {formatDate(file.createdAt!)}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(file.id)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default FileCard;
