import { NextRequest, NextResponse } from "next/server";

import { queries } from "@bytebank-web-auth/lib/database/queries";
import { AuthService } from "@bytebank-web-auth/lib/services/auth-service";
import { handleResponseError } from "@fiap-tech-challenge/services/http";

const service = new AuthService(queries);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const user = await service.signInWithPassword(data.email, data.password);
    return NextResponse.json(user);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function GET() {
  try {
    const user = await service.getCurrentUser();
    return NextResponse.json(user);
  } catch (err) {
    return handleResponseError(err);
  }
}
