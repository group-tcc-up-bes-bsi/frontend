export enum organizationType {
  ALL = "Todos",
  INDIVIDUAL = "Individual",
  COLLABORATIVE = "Colaborativo",
}

export enum userType {
  OWNER = "Proprietário",
  WRITE = "Editor",
  READ = "Visualizador",
}

export const organizationsTypeOptions = [
  { value: "ALL", label: "Todos" },
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "COLLABORATIVE", label: "Colaborativo" }
];

export const organizationsTypeOptionsNoAll = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "COLLABORATIVE", label: "Colaborativo" }
];

export const userTypeOptions = [
  { value: "OWNER", label: "Proprietário" },
  { value: "WRITE", label: "Editor" },
  { value: "READ", label: "Visualizador" }
];

export const userTypeOptionsNoOwner = [
  { value: "WRITE", label: "Editor" },
  { value: "READ", label: "Visualizador" }
];

export function getUserTypeLabel(value: string): string {
  const option = userTypeOptions.find(opt => opt.value === value.toUpperCase());
  return option ? option.label : value;
}
