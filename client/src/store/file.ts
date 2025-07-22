import { deleteFile, listFiles } from "@/api";
import type { FileItem } from "@/types";
import { create } from "zustand";

type FileDataType = {
  presignedUrl: string;
  fileUrl: string;
  key: string;
};

type FileStore = {
  file: FileItem | null;
  fileData: FileDataType;
  setFileData: (fileDate: FileDataType) => void;
  setFile: (file: FileItem) => void;
  fetchFile: (email: string) => Promise<FileItem[] | null>;
  clearFile: (id: string) => Promise<void>;
  loading: boolean;
};

export const useFileStore = create<FileStore>((set) => ({
  file: null,
  fileData: {
    presignedUrl: "",
    fileUrl: "",
    key: "",
  },
  setFileData: (fileData) => set({ fileData }),
  setFile: (file) => set({ file }),
  fetchFile: async (email: string) => {
    set({ loading: true });
    try {
      const data = await listFiles(email);
      set({ file: data, loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      console.warn("Failed to fetch file:", err);
      return null;
    }
  },
  clearFile: async (id: string) => {
    await deleteFile(id);
    set({ file: null, loading: false });
  },
  loading: false,
}));
