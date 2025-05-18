import { NextResponse } from "next/server";
import { HttpError } from "../http-error";

export function handleResponseError(err: unknown) {
  if (err instanceof HttpError) {
    return new NextResponse(err.message, { status: err.status });
  }
  return new NextResponse('Internal Server Error', { status: 500 });
}
