import { create } from "zustand";
import { deleteFile, listFiles } from "@/api";
import type { FileItem } from "@/types";
import { createJSONStorage, persist } from "zustand/middleware";

type FileDataType = {
  presignedUrl: string;
  fileUrl: string;
  key: string;
};

export type StatusType = "IDLE" | "PROCESSING" | "READY" | "ERROR";

type FileStore = {
  file: FileItem | null;
  setFile: (file: FileItem) => void;
  fileData: FileDataType;
  curFileKey: string;
  setFileData: (fileDate: FileDataType) => void;
  fetchFile: () => Promise<FileItem[] | null>;
  clearFile: (s3Key: string) => Promise<void>;
  loading: boolean;
  status: StatusType;
  setStatus: (status: StatusType) => void;
};

export const useFileStore = create<FileStore>()(
  persist(
    (set, get) => ({
      file: null,
      fileData: {
        presignedUrl: "",
        fileUrl: "",
        key: "",
      },
      curFileKey: "",
      loading: false,
      setFile: (file) => set({ file }),
      setFileData: (fileData) => {
        set({ fileData });
        if (fileData.key) {
          set({ curFileKey: fileData.key });
        }
      },
      fetchFile: async () => {
        const key = get().curFileKey;
        if (!key) return null;
        set({ loading: true });
        try {
          const data = await listFiles(key);
          set({ file: data, loading: false });
          return data;
        } catch (err) {
          set({ loading: false });
          console.warn("Failed to fetch file:", err);
          return null;
        }
      },
      clearFile: async (s3Key: string) => {
        set({ file: null, loading: false, curFileKey: "" });
        await deleteFile(s3Key);
      },
      status: "IDLE" as StatusType,
      setStatus: (status: StatusType) => set({ status }),
    }),
    {
      name: "fileKey",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        curFileKey: state.curFileKey,
      }),
    }
  )
);
