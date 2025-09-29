import { VersionObj } from "@/app/models/VersionObj";

export function buildPieDataVersions(versions: VersionObj[]) {
  if (!versions || versions.length === 0) {
    return [];
  }

  const counts: Record<string, number> = {};

  versions.forEach((version) => {
    const userName = version.user?.username || "Desconhecido";
    counts[userName] = (counts[userName] || 0) + 1;
  });

  return Object.entries(counts).map(([label, value], index) => ({
    id: index,
    value,
    label,
  }));
}
