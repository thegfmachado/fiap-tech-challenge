import { HttpError } from "./http-error.js";

export function handleResponseError(err: unknown) {
  if (err instanceof HttpError) {
    return new Response(err.message, { status: err.status });
  }

  if (err instanceof Error && err.message.includes('not found')) {
    return new Response(err.message, { status: 404 });
  }

  return new Response('Internal Server Error', { status: 500 });
}
