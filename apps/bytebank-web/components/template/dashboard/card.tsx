import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@fiap-tech-challenge/design-system/components";
import { formatCurrency } from "@fiap-tech-challenge/utils";

export function DashboardCard({
  title,
  value,
  iconSrc,
  valueColor,
  percentage,
  filter
}: {
  title: string;
  value: number;
  iconSrc: string;
  valueColor: string;
  percentage: string;
  filter: string;
}) {

  const periodLabelMap: Record<string, string> = {
    week: "semana",
    month: "mês",
    year: "ano",
  };

  const periodLabel = periodLabelMap[filter] ?? "período";

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row justify-between w-full items-center pb-2">
        <CardTitle className="text-muted-foreground text-sm m-0">{title}</CardTitle>
        <Image src={iconSrc} width={24} height={24} alt={title} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color: valueColor }}>{formatCurrency(value, { signDisplay: "never" })}</div>
        <div className="text-xs text-muted-foreground">{percentage} vs {periodLabel} anterior</div>
      </CardContent>
    </Card>
  );
}
