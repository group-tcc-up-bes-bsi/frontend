import { create } from "zustand";

interface OrganizationFormState {
  organizationForm: boolean;
  alter: (by: boolean) => void;
}

export const useOrganizationFormStore = create<OrganizationFormState>()((set) => ({
  organizationForm: false,
  alter: (by) => set(() => ({ organizationForm: by })),
}));
