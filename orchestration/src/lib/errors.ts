import { NextResponse } from 'next/server';

export function badRequest(message: string) {
  return NextResponse.json(
    { error: { code: 'BAD_REQUEST', message } },
    { status: 400 },
  );
}

export function notFound(message: string) {
  return NextResponse.json(
    { error: { code: 'NOT_FOUND', message } },
    { status: 404 },
  );
}

export function conflict(message: string) {
  return NextResponse.json(
    { error: { code: 'CONFLICT', message } },
    { status: 409 },
  );
}

export function serverError(message: string) {
  return NextResponse.json(
    { error: { code: 'SERVER_ERROR', message } },
    { status: 500 },
  );
}
