import { create } from "zustand";

interface ThemeState {
    theme: boolean;
    alter: (by: boolean) => void;
}

function getThemeStorage(): boolean {
    if (typeof window !== 'undefined') {
        const theme = localStorage.getItem("theme")
        if (theme === "true") return true;
        if (theme === "false") return false;
    }
    return false;
}

export const useThemeStore = create<ThemeState>()((set) => ({
    theme: getThemeStorage(),
    alter: (by) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("theme", String(by));
        }
        set(() => ({ theme: by }))
    }
}));
