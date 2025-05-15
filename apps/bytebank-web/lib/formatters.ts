export function formatDate(date: Date, dateStyle: Intl.DateTimeFormatOptions["dateStyle"] = 'short'): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle,
  }).format(date);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    signDisplay: "always",
    style: "currency",
  }).format(value);
}
