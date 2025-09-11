import { create } from "zustand";
import { OrganizationObj } from "../models/OrganizationObj";

interface OrganizationState {
  organization: OrganizationObj | undefined;
  alter: (by: OrganizationObj) => void;
}

export const useOrganizationStore = create<OrganizationState>()((set) => ({
  organization: undefined,
  alter: (by) => set(() => ({ organization: by })),
}));
