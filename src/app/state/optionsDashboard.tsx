import { create } from "zustand";

interface OptionsDashboardState {
  option: string;
  lastOption: string;
  alter: (by: string) => void;
}

export const useOptionsDashboardStore = create<OptionsDashboardState>()((set, get) => ({
  option: "Home",
  lastOption: "Home",
  alter: (by) =>
    set(() => ({
      lastOption: get().option,
      option: by,
    })),
}));
