import { useFileStore, type StatusType } from "@/store/file";
import Spinner from "./Spinner";
import type { ReactElement } from "react";

const StatusBanner = () => {
  const { status } = useFileStore();

  const statusMessages: Record<StatusType, string | ReactElement> = {
    IDLE: "Please upload the file and wait while we process it. Once it`s ready, you`ll be able to start chatting.",
    UPLOADING: <Spinner />,
    PROCESSING: <Spinner />,
    READY: "Start a conversation.",
    ERROR: "Something went wrong. Please try again.",
  };

  const renderStatusMessage = statusMessages[status];

  return (
    <div className="text-center text-stone-400 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      {renderStatusMessage}
    </div>
  );
};

export default StatusBanner;
