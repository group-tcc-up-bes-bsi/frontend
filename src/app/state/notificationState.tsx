import { create } from "zustand";

interface NotificationState {
  openNotification: boolean;
  alter: (by: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  openNotification: false,
  alter: (by) => set(() => ({ openNotification: by })),
}));
