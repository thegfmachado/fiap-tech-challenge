import { cookies } from "next/headers";

import { AuthQueriesService } from "@fiap-tech-challenge/database/queries";
import { createServerClient } from "@fiap-tech-challenge/database/server";

import { AuthService } from "./auth-service";

export async function createAuthService() {
  const cookieStore = await cookies();
  const client = await createServerClient(cookieStore);
  return new AuthService(new AuthQueriesService(client));
}
