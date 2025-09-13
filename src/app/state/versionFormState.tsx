import { create } from "zustand";

interface VersionFormState {
  versionForm: boolean;
  alter: (by: boolean) => void;
}

export const useVersionFormStore = create<VersionFormState>()((set) => ({
  versionForm: false,
  alter: (by) => set(() => ({ versionForm: by })),
}));
