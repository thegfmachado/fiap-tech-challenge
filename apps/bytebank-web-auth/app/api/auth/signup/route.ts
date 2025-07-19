import { NextRequest, NextResponse } from "next/server";

import { AuthService } from "@bytebank-web-auth/lib/services/auth-service";
import { handleResponseError } from "@fiap-tech-challenge/services/http";

const service = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const user = await service.signUp(data);
    return NextResponse.json(user);
  } catch (err) {
    return handleResponseError(err);
  }
}
