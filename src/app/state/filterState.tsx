import { create } from 'zustand';

interface FilterState {
  filter: string;
  setFilter: (by: string) => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  filter: '',
  setFilter: (by) => set(() => ({ filter: by })),
}));
