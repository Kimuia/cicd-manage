import { NextRequest, NextResponse } from 'next/server';
import { listQuerySchema } from '@/lib/validation';
import { buildRepository } from '@/db/repositories/build.repository';
import { serverError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = listQuerySchema.parse(Object.fromEntries(searchParams));
    const builds = buildRepository.findAll({
      status: query.status,
      limit: query.limit,
      offset: query.offset,
    });

    return NextResponse.json({ builds });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
