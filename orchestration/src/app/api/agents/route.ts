import { NextResponse } from 'next/server';
import { agentRepository } from '@/db/repositories/agent.repository';
import { serverError } from '@/lib/errors';

export async function GET() {
  try {
    const agents = agentRepository.findAll();
    return NextResponse.json({ agents });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
