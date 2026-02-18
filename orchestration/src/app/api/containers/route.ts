import { NextRequest, NextResponse } from 'next/server';
import { listQuerySchema } from '@/lib/validation';
import { containerRepository } from '@/db/repositories/container.repository';
import { serverError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = listQuerySchema.parse(Object.fromEntries(searchParams));
    const containers = containerRepository.findAll({
      status: query.status,
      limit: query.limit,
      offset: query.offset,
    });

    return NextResponse.json({ containers });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
