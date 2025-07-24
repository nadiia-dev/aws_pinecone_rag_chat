import { create } from "zustand";
import { deleteFile, listFiles } from "@/api";
import type { FileItem } from "@/types";
import { createJSONStorage, persist } from "zustand/middleware";

type FileDataType = {
  presignedUrl: string;
  fileUrl: string;
  key: string;
};

type FileStore = {
  file: FileItem | null;
  fileData: FileDataType;
  curFileKey: string;
  setFileData: (fileDate: FileDataType) => void;
  fetchFile: () => Promise<FileItem[] | null>;
  clearFile: (s3Key: string) => Promise<void>;
  loading: boolean;
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
      setFileData: (fileData) => {
        set({ fileData });
        if (fileData.key) {
          set({ curFileKey: fileData.key });
        }
      },
      fetchFile: async () => {
        const key = get().curFileKey;
        if (!key) return null;
        console.log(key);
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
        await deleteFile(s3Key);
        set({ file: null, loading: false, curFileKey: "" });
      },
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
