// Exportando como const por enquanto em vez de enum por conta de conflito de type
// Os valores são os mesmos, mas com enum acontece do TS dizer que não é possível atribuir o valor
export const TransactionType = {
  CREDIT: "credit",
  DEBIT: "debit",
} as const;
