import { useFileStore } from "@/store/file";
import FileCard from "./FileCard";
import FileInput from "./FileInput";

const FileBlock = () => {
  const { file } = useFileStore();
  return (
    <aside className="w-full xl:w-[450px] divider pt-4 px-4 md:px-6">
      {file && <FileCard file={file} />}
      <FileInput />
    </aside>
  );
};

export default FileBlock;
