import { create } from "zustand";

interface OptionsDashboardState {
  option: string;
  alter: (by: string) => void;
}

export const useOptionsDashboardStore = create<OptionsDashboardState>()((set) => ({
  option: "Home",
  alter: (by) => set(() => ({ option: by })),
}));
