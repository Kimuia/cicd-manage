import { config } from './config.js';
import type { AgentRegistrationPayload, HeartbeatPayload } from './types.js';
import {
  getHostname,
  getIpAddress,
  getDockerVersion,
  getTotalMemory,
  getFreeDisk,
  getCpuUsage,
  getMemoryUsage,
  getDiskUsage,
} from './utils/system-info.js';

const currentJobs = new Set<string>();
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

/** 현재 실행 중인 작업 추가 */
export function addCurrentJob(jobId: string): void {
  currentJobs.add(jobId);
}

/** 완료된 작업 제거 */
export function removeCurrentJob(jobId: string): void {
  currentJobs.delete(jobId);
}

/** 오케스트레이션 서버에 에이전트 등록 */
export async function registerAgent(): Promise<void> {
  const payload: AgentRegistrationPayload = {
    agentId: config.agentId,
    agentType: config.agentType,
    hostname: getHostname(),
    ipAddress: getIpAddress(),
    capabilities: {
      dockerVersion: await getDockerVersion(),
      diskSpace: getFreeDisk(),
      memory: getTotalMemory(),
    },
  };

  try {
    const res = await fetch(`${config.orchestrationUrl}/api/agents/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`에이전트 등록 완료: ${config.agentId}`);
    } else {
      console.warn(`에이전트 등록 실패: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.warn(`에이전트 등록 실패 (오케스트레이션 서버 연결 불가): ${(err as Error).message}`);
  }
}

/** 오케스트레이션 서버에 상태 전송 */
async function sendHeartbeat(): Promise<void> {
  const payload: HeartbeatPayload = {
    timestamp: Date.now(),
    status: currentJobs.size > 0 ? 'busy' : 'online',
    currentJobs: [...currentJobs],
    metrics: {
      cpuUsage: getCpuUsage(),
      memoryUsage: getMemoryUsage(),
      diskUsage: getDiskUsage(),
    },
  };

  try {
    const res = await fetch(
      `${config.orchestrationUrl}/api/agents/${config.agentId}/heartbeat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      console.warn(`하트비트 전송 실패: ${res.status}`);
    }
  } catch {
    // 오케스트레이션 서버 연결 불가 - 무시
  }
}

/** 하트비트 타이머 시작 (30초 간격) */
export function startHeartbeat(): void {
  if (heartbeatTimer) return;
  heartbeatTimer = setInterval(sendHeartbeat, config.heartbeatIntervalMs);
  console.log(`하트비트 시작 (${config.heartbeatIntervalMs / 1000}초 간격)`);
}

/** 하트비트 타이머 중지 */
export function stopHeartbeat(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}
