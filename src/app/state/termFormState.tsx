import { create } from "zustand";

interface TermFormState {
  termForm: boolean;
  termText: string;
  alter: (by: boolean) => void;
  alterText: (by: string) => void;
}

export const useTermFormStore = create<TermFormState>()((set) => ({
  termForm: false,
  termText: '',
  alter: (by) => set(() => ({ termForm: by })),
  alterText: (by) => set(() => ({termText: by}))
}));
