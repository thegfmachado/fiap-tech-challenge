import { NextRequest, NextResponse } from "next/server";

import { createAuthService } from "@bytebank-web-auth/lib/services/auth-service.factory";
import { handleResponseError } from "@fiap-tech-challenge/services/http";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const service = await createAuthService();
    const user = await service.signInWithPassword(data.email, data.password);
    return NextResponse.json(user);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function GET() {
  try {
    const service = await createAuthService();
    const user = await service.getCurrentUser();
    return NextResponse.json(user);
  } catch (err) {
    return handleResponseError(err);
  }
}
