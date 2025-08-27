import { create } from "zustand";

export interface Admin { userId: number, UserName: string, Password: string, AdminPass: string }

interface AdminPassState {
  showAdminRequest: boolean;
  Admin: Admin | null;
  alter: (by: boolean) => void;
  alterAdmin: (admin: Admin | null) => void;
}

export const useAdminPassStore = create<AdminPassState>()((set) => ({
  showAdminRequest: false,
  Admin: null,
  alter: (by) => set(() => ({ showAdminRequest: by })),
  alterAdmin: (admin) => set(() => ({ Admin: admin })),
}));
