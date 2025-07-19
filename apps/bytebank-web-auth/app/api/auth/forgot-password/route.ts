import { NextRequest, NextResponse } from "next/server";

import { AuthService } from "@bytebank-web-auth/lib/services/auth-service";
import { handleResponseError } from "@fiap-tech-challenge/services/http";

const service = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await service.forgotPassword(data.email);
    return NextResponse.json({ message: 'Email de recuperação enviado com sucesso.' });
  } catch (err) {
    return handleResponseError(err);
  }
}
