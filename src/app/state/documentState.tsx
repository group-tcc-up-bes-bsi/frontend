import { create } from "zustand";
import { DocumentObj } from "../models/DocumentObj";

interface DocumentState {
  document: DocumentObj | undefined;
  alter: (by: DocumentObj) => void;
}

export const useDocumentStore = create<DocumentState>()((set) => ({
  document: undefined,
  alter: (by) => set(() => ({ document: by })),
}));
