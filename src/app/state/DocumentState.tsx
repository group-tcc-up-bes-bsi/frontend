import { create } from "zustand";
import { FileItem } from "../models/FileItem";

interface DocumentState {
  document: FileItem | undefined;
  alter: (by: FileItem) => void;
}

export const useDocumentStateStore = create<DocumentState>()((set) => ({
  document: undefined,
  alter: (by) => set(() => ({ document: by })),
}));
