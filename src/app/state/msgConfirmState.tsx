import { create } from "zustand";

interface MsgConfirmState {
  openConfirm: boolean;
  msgConfirm: string;
  confirm: boolean;
  alter: (by: boolean) => void;
  alterConfirm: (by: boolean) => void;
  alterMsg: (by: string) => void;
}

export const useMsgConfirmStore = create<MsgConfirmState>()((set) => ({
  openConfirm: false,
  msgConfirm: '',
  confirm: false,
  alter: (by) => set(() => ({ openConfirm: by })),
  alterConfirm: (by) => set(() => ({ confirm: by })),
  alterMsg: (by) => set(() => ({ msgConfirm: by })),
}));
