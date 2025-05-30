import { create } from "zustand";

interface DocumentViewerState {
  mode: number;
  alter: (by: number) => void;
}

export const useDocumentViewerStore = create<DocumentViewerState>()((set) => ({
  mode: 1,
  alter: (by) => set(() => ({ mode: by })),
}));
