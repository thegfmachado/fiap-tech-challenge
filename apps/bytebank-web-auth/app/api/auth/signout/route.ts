import { NextResponse } from "next/server";

import { queries } from "@bytebank-web-auth/lib/database/queries";
import { AuthService } from "@bytebank-web-auth/lib/services/auth-service";
import { handleResponseError } from "@fiap-tech-challenge/services/http";

const service = new AuthService(queries);

export async function POST() {
  try {
    await service.signOut();
    return NextResponse.json({ message: "User signed out successfully" }, { status: 200 });
  } catch (err) {
    return handleResponseError(err);
  }
}
