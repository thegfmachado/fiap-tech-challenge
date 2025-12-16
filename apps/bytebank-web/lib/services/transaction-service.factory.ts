import { cookies } from "next/headers";

import { TransactionsQueriesService } from "@fiap-tech-challenge/database/queries";
import { createServerClient } from "@fiap-tech-challenge/database/server";

import { TransactionService } from "./transaction-service";

export async function createTransactionService() {
  const cookieStore = await cookies();
  const client = await createServerClient(cookieStore);
  return new TransactionService(new TransactionsQueriesService(client));
}
