import { NextResponse } from "next/server";
import { HttpError } from "../http-error";

export function handleResponseError(err: unknown) {
  if (err instanceof HttpError) {
    return new NextResponse(err.message, { status: err.status });
  }
  
  if (err instanceof Error && err.message.includes('not found')) {
    return new NextResponse(err.message, { status: 404 });
  }
  
  return new NextResponse('Internal Server Error', { status: 500 });
}
