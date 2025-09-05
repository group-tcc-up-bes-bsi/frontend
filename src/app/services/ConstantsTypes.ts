export enum organizationType {
  ALL = "Todos",
  INDIVIDUAL = "Individual",
  COLLABORATIVE = "Colaborativo",
}

export enum userType {
  OWNER = "Proprietário",
  READ = "Editor",
  VIEWER = "Visualizador",
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
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "COLLABORATIVE", label: "Colaborativo" }
];

export const userTypeOptionsNoOwner = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "COLLABORATIVE", label: "Colaborativo" }
];