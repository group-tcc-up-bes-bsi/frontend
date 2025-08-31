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

export const organizationsTypeOptions = Object.entries(organizationType).map(
  ([key, value]) => ({
    value: key,
    label: value,
  })
);

export const organizationsTypeOptionsNoAll = Object.entries(organizationType)
  .filter(([key]) => key !== "ALL")
  .map(([key, value]) => ({
    value: key,
    label: value,
  }));

export const userTypeOptions = Object.entries(userType).map(([key, value]) => ({
  value: key,
  label: value,
}));
