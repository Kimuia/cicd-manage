import { agentRepository } from '@/db/repositories/agent.repository';
import { buildRepository } from '@/db/repositories/build.repository';
import { deploymentRepository } from '@/db/repositories/deployment.repository';
import { eventBus } from './event-bus';
import type { AgentRow } from './types';

export function selectAgent(type: 'build' | 'deploy'): AgentRow | undefined {
  const agents = agentRepository.findByType(type);
  if (agents.length === 0) return undefined;

  const online = agents.filter((a) => a.status === 'online');
  if (online.length > 0) return online[0];

  return agents[0];
}

export async function triggerBuild(agentId: string, payload: {
  buildId: string;
  gitUrl: string;
  gitBranch: string;
  gitCommit?: string;
  dockerfilePath: string;
  imageName: string;
  imageTag: string;
  buildArgs?: Record<string, string>;
}): Promise<Response> {
  const agent = agentRepository.findById(agentId);
  if (!agent) throw new Error(`Agent ${agentId} not found`);

  const agentUrl = `http://${agent.ip_address}:4001`;
  return fetch(`${agentUrl}/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function triggerBuildAndTrack(agentId: string, payload: {
  buildId: string;
  gitUrl: string;
  gitBranch: string;
  gitCommit?: string;
  dockerfilePath: string;
  imageName: string;
  imageTag: string;
  buildArgs?: Record<string, string>;
}): Promise<void> {
  const { buildId } = payload;

  try {
    const res = await triggerBuild(agentId, payload);

    if (!res.body) {
      buildRepository.updateStatus(buildId, 'failed', { errorMessage: 'No SSE stream from build agent' });
      eventBus.emit('build:failed', { buildId });
      return;
    }

    buildRepository.updateStatus(buildId, 'running', { startedAt: new Date().toISOString() });
    eventBus.emit('build:started', { buildId });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      let eventType = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          try {
            const data = JSON.parse(dataStr);

            if (eventType === 'progress') {
              buildRepository.appendLog(buildId, `[${data.phase}] ${data.message}`);
              eventBus.emit('build:progress', { buildId, ...data });
            } else if (eventType === 'complete') {
              buildRepository.updateStatus(buildId, 'success', { completedAt: new Date().toISOString() });
              eventBus.emit('build:completed', { buildId, ...data });
            } else if (eventType === 'error') {
              buildRepository.updateStatus(buildId, 'failed', {
                errorMessage: data.message,
                completedAt: new Date().toISOString(),
              });
              eventBus.emit('build:failed', { buildId, message: data.message });
            }
          } catch {
            // skip malformed JSON
          }
          eventType = '';
        }
      }
    }
  } catch (err) {
    buildRepository.updateStatus(buildId, 'failed', {
      errorMessage: (err as Error).message,
      completedAt: new Date().toISOString(),
    });
    eventBus.emit('build:failed', { buildId, message: (err as Error).message });
  }
}

export async function triggerDeploy(agentId: string, payload: {
  deploymentId: string;
  imageTarPath: string;
  imageName: string;
  containerName: string;
  portMappings: Array<{ host: number; container: number }>;
  envVars?: Record<string, string>;
}): Promise<Response> {
  const agent = agentRepository.findById(agentId);
  if (!agent) throw new Error(`Agent ${agentId} not found`);

  const agentUrl = `http://${agent.ip_address}:4002`;
  return fetch(`${agentUrl}/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function triggerDeployAndTrack(agentId: string, payload: {
  deploymentId: string;
  imageTarPath: string;
  imageName: string;
  containerName: string;
  portMappings: Array<{ host: number; container: number }>;
  envVars?: Record<string, string>;
}): Promise<void> {
  const { deploymentId } = payload;

  try {
    const res = await triggerDeploy(agentId, payload);

    if (!res.body) {
      deploymentRepository.updateStatus(deploymentId, 'failed', { errorMessage: 'No SSE stream from deploy agent' });
      eventBus.emit('deployment:failed', { deploymentId });
      return;
    }

    deploymentRepository.updateStatus(deploymentId, 'deploying', { startedAt: new Date().toISOString() });
    eventBus.emit('deployment:started', { deploymentId });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      let eventType = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          try {
            const data = JSON.parse(dataStr);

            if (eventType === 'progress') {
              eventBus.emit('deployment:progress', { deploymentId, ...data });
            } else if (eventType === 'complete') {
              deploymentRepository.updateStatus(deploymentId, 'running', {
                containerId: data.containerId,
              });
              eventBus.emit('deployment:completed', { deploymentId, ...data });
            } else if (eventType === 'error') {
              deploymentRepository.updateStatus(deploymentId, 'failed', {
                errorMessage: data.message,
              });
              eventBus.emit('deployment:failed', { deploymentId, message: data.message });
            }
          } catch {
            // skip malformed JSON
          }
          eventType = '';
        }
      }
    }
  } catch (err) {
    deploymentRepository.updateStatus(deploymentId, 'failed', {
      errorMessage: (err as Error).message,
    });
    eventBus.emit('deployment:failed', { deploymentId, message: (err as Error).message });
  }
}

export function getAgentUrl(agent: AgentRow): string {
  const port = agent.type === 'build' ? 4001 : 4002;
  return `http://${agent.ip_address}:${port}`;
}
