import { create } from "zustand";

interface DocumentFormState {
  documentForm: boolean;
  alter: (by: boolean) => void;
}

export const useDocumentFormStore = create<DocumentFormState>()((set) => ({
  documentForm: false,
  alter: (by) => set(() => ({ documentForm: by })),
}));
