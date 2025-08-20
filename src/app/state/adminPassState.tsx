import { create } from "zustand";

interface AdminPassState {
  showAdminRequest: boolean;
  alter: (by: boolean) => void;
}

export const useAdminPassStore = create<AdminPassState>()((set) => ({
  showAdminRequest: false,
  alter: (by) => set(() => ({ showAdminRequest: by })),
}));
