import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@fiap-tech-challenge/design-system/components";
import { formatCurrency } from "@bytebank/client/formatters";

export function DashboardCard({
  title,
  value,
  iconSrc,
  valueColor,
  percentage
}: {
  title: string;
  value: number;
  iconSrc: string;
  valueColor: string;
  percentage: string
}) {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row justify-between w-full items-center pb-2">
        <CardTitle className="text-muted-foreground text-sm m-0">{title}</CardTitle>
        <Image src={iconSrc} width={24} height={24} alt={title} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color: valueColor }}>{formatCurrency(value)}</div>
        <div className="text-xs text-muted-foreground">{percentage} vs mês anterior</div>
      </CardContent>
    </Card>
  );
}
