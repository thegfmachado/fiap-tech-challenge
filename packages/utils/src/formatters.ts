export function formatDate(
  date: Date,
  dateStyle: Intl.DateTimeFormatOptions["dateStyle"] = "short",
): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle,
  }).format(date);
}

export function formatCurrency(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
    ...options,
  }).format(value);
}
