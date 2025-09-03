import { create } from "zustand";
import { UserObj } from "../models/UserObj";

interface UserState {
  userCurrent: UserObj | undefined;
  alter: (by: UserObj) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  userCurrent: undefined,
  alter: (by) => set(() => ({ userCurrent: by })),
}));
