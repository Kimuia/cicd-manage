import { NextRequest, NextResponse } from 'next/server';
import { agentRegisterSchema } from '@/lib/validation';
import { agentRepository } from '@/db/repositories/agent.repository';
import { eventBus } from '@/lib/event-bus';
import { badRequest, serverError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = agentRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const { agentId, agentType, hostname, ipAddress, capabilities, publicKey } = parsed.data;

    const agent = agentRepository.upsert({
      id: agentId,
      type: agentType,
      hostname,
      ipAddress,
      capabilities,
      publicKey,
    });

    eventBus.emit('agent:online', { agentId, agentType, hostname });

    return NextResponse.json(agent, { status: 201 });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
