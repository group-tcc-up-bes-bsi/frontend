import { create } from "zustand";

type ChartData = { id: number; value: number; label: string }[];

interface DataDocumentVersionState {
  dataBar: ChartData | undefined;
  dataPie: ChartData | undefined;
  alterBar: (by: ChartData) => void;
  alterPie: (by: ChartData) => void;
}

export const useDocumentVersionStore = create<DataDocumentVersionState>()((set) => ({
  dataBar: undefined,
  dataPie: undefined,
  alterBar: (by) => set(() => ({ dataBar: by })),
  alterPie: (by) => set(() => ({ dataPie: by })),
}));
