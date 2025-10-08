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

export enum logsType {
  CREATED = "Documento criado",
  UPDATED = "Documento alterado",
  DELETED = "Documento excluído",
  TRASHED = "Documento enviado para à lixeira",
  RESTORED = "Documento restaurado da lixeira",
  CREATED_VERSION = "Adicionada nova versão",
  UPDATED_VERSION = "Versão atualizada",
  DELETED_VERSION = "Versão deletada",
}

export const organizationsTypeOptions = [
  { value: "ALL", label: "Todos" },
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "COLLABORATIVE", label: "Colaborativo" },
];

export const organizationsTypeOptionsNoAll = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "COLLABORATIVE", label: "Colaborativo" },
];

export const userTypeOptions = [
  { value: "OWNER", label: "Proprietário" },
  { value: "WRITE", label: "Editor" },
  { value: "READ", label: "Visualizador" },
];

export const userTypeOptionsNoOwner = [
  { value: "WRITE", label: "Editor" },
  { value: "READ", label: "Visualizador" },
];

export const userInviteAcceptedOptions = [
  { value: "all", label: "Todos" },
  { value: "true", label: "Aceito" },
  { value: "false", label: "Pendente" },
];

export const favoriteTypeOptions = [
  { value: "all", label: "Todos" },
  { value: "true", label: "Favoritos" },
  { value: "false", label: "Não Favoritos" },
]

export function getUserTypeLabel(value: string): string {
  const option = userTypeOptions.find(
    (opt) => opt.value === value.toUpperCase()
  );
  return option ? option.label : value;
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};