import { create } from "zustand";
import type { UploadResponse } from "../api/upload";

interface FileStore {
  files: UploadResponse[];
  addFile: (file: UploadResponse) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
}));
