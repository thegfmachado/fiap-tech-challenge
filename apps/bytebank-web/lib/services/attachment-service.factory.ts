import { cookies } from "next/headers";

import { createServerClient } from "@fiap-tech-challenge/database/server";
import { StorageService, AttachmentService } from "@fiap-tech-challenge/services";

export async function createAttachmentService() {
  const cookieStore = await cookies();
  const client = await createServerClient(cookieStore);
  const storageService = new StorageService(client);
  return new AttachmentService(storageService);
}
