import { create } from "zustand";

interface MsgConfirmState {
  openConfirm: boolean;
  msgConfirm: string;
  alter: (by: boolean) => void;
  alterMsg: (by: string) => void;
}

export const useMsgConfirmStore = create<MsgConfirmState>()((set) => ({
  openConfirm: false,
  msgConfirm: '',
  alter: (by) => set(() => ({ openConfirm: by })),
  alterMsg: (by) => set(() => ({ msgConfirm: by })),
}));
