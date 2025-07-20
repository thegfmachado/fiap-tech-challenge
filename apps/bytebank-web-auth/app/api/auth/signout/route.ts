import { NextResponse } from "next/server";

import { createAuthService } from "@bytebank-web-auth/lib/services/auth-service.factory";
import { handleResponseError } from "@fiap-tech-challenge/services/http";

export async function POST() {
  try {
    const service = await createAuthService();
    await service.signOut();
    return NextResponse.json({ message: "User signed out successfully" }, { status: 200 });
  } catch (err) {
    return handleResponseError(err);
  }
}
