import { create } from "zustand";

interface AuditLogState {
  openLog: boolean;
  alter: (by: boolean) => void;
}

export const useAuditLogStore = create<AuditLogState>()((set) => ({
  openLog: false,
  alter: (by) => set(() => ({ openLog: by })),
}));
