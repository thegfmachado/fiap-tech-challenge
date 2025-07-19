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

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return new NextResponse('Invalid or empty password reset data', { status: 400 });
    }

    const updated = await service.updateUserPassword(data.password);
    return NextResponse.json(updated);
  } catch (err) {
    return handleResponseError(err);
  }
}
