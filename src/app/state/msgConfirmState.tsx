import { create } from "zustand";

interface MsgConfirmState {
  openConfirm: boolean;
  msgConfirm: string;
  confirm: boolean;
  onConfirm: (() => Promise<void>) | null;
  alter: (by: boolean) => void;
  alterConfirm: (by: boolean) => void;
  alterMsg: (by: string) => void;
  setOnConfirm: (fn: (() => Promise<void>) | null) => void;
}

export const useMsgConfirmStore = create<MsgConfirmState>()((set) => ({
  openConfirm: false,
  msgConfirm: '',
  confirm: false,
  onConfirm: null,
  alter: (by) => set(() => ({ openConfirm: by })),
  alterConfirm: (by) => set(() => ({ confirm: by })),
  alterMsg: (by) => set(() => ({ msgConfirm: by })),
  setOnConfirm: (fn) => set({ onConfirm: fn }),
}));
