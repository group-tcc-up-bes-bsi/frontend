import { create } from "zustand";
import { VersionObj } from "../models/VersionObj";

interface VersionState {
  version: VersionObj | undefined;
  alter: (by: VersionObj) => void;
}

export const useVersionStore = create<VersionState>()((set) => ({
  version: undefined,
  alter: (by) => set(() => ({ version: by })),
}));
