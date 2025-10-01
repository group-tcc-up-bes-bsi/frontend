import { VersionObj } from "@/app/models/VersionObj";

interface ChartData {
  id: number;
  label: string;
  value: number;
}

export function buildBarDataVersions(
  versions: VersionObj[],
  monthsCount: number
): ChartData[] {
  if (!versions || versions.length === 0) {
    return [];
  }

  const now = new Date();
  const months: ChartData[] = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const label = date
      .toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
      .replace(".", "");

    const count = versions.filter((v) => {
      const created = new Date(v.creationDate);
      return (
        created.getMonth() === date.getMonth() &&
        created.getFullYear() === date.getFullYear()
      );
    }).length;

    months.push({
      id: monthsCount - i,
      label,
      value: count,
    });
  }

  return months;
}
