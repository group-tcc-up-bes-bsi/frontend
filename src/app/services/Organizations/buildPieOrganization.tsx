import { UserOrganization } from "@/app/models/UserObj";
import { getUserTypeLabel } from "../ConstantsTypes";
import { DocumentObj } from "@/app/models/DocumentObj";

export function buildPieDataUser(users: UserOrganization[]) {
  if (!users || users.length === 0) {
    return [];
  }

  const counts: Record<string, number> = {};

  users.forEach((user) => {
    const type = user.userType || "Desconhecido";
    counts[type] = (counts[type] || 0) + 1;
  });

  return Object.entries(counts).map(([label, value], index) => ({
    id: index,
    value,
    label: getUserTypeLabel(label),
  }));
}

export function buildPieDataDocumentsType(documents: DocumentObj[]) {
  if (!documents || documents.length === 0) {
    return [];
  }

  const counts: Record<string, number> = {};

  documents.forEach((doc) => {
    const type = doc.type || "Desconhecido";
    counts[type] = (counts[type] || 0) + 1;
  });

  return Object.entries(counts).map(([label, value], index) => ({
    id: index,
    value,
    label,
  }));
}