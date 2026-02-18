import type { Response } from 'express';

/** 에이전트 시스템 역량 정보 */
export interface AgentCapabilities {
  dockerVersion: string;
  gitVersion: string;
  diskSpace: number;
  memory: number;
}

/** 에이전트 등록 요청 페이로드 */
export interface AgentRegistrationPayload {
  agentId: string;
  agentType: 'build' | 'deploy';
  hostname: string;
  ipAddress: string;
  capabilities: AgentCapabilities;
}

/** 하트비트 페이로드 - 주기적으로 오케스트레이션 서버에 전송 */
export interface HeartbeatPayload {
  timestamp: number;
  status: 'online' | 'busy';
  currentJobs: string[];
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

/** 빌드 요청 입력 */
export interface BuildRequest {
  buildId: string;
  gitUrl: string;
  gitBranch: string;
  gitCommit?: string;
  dockerfilePath: string;
  imageName: string;
  imageTag: string;
  buildArgs?: Record<string, string>;
}

/** 빌드 단계 */
export type BuildPhase =
  | 'queued'
  | 'cloning'
  | 'building'
  | 'saving'
  | 'compressing'
  | 'transferring'
  | 'cleanup'
  | 'complete'
  | 'error';

/** 빌드 진행 상황 (SSE 이벤트 데이터) */
export interface BuildProgress {
  buildId: string;
  phase: BuildPhase;
  progress: number;
  message: string;
}

/** SSE 메시지 전송 인터페이스 */
export interface SSEWriter {
  sendProgress: (phase: BuildPhase, progress: number, message: string) => void;
  sendComplete: (imageName: string) => void;
  sendError: (message: string) => void;
  close: () => void;
}

/** SSE 응답 래퍼 생성 */
export function createSSEWriter(res: Response, buildId: string): SSEWriter {
  return {
    sendProgress(phase, progress, message) {
      const data: BuildProgress = { buildId, phase, progress, message };
      res.write(`event: progress\ndata: ${JSON.stringify(data)}\n\n`);
    },
    sendComplete(imageName) {
      res.write(`event: complete\ndata: ${JSON.stringify({ buildId, status: 'success', imageName })}\n\n`);
    },
    sendError(message) {
      res.write(`event: error\ndata: ${JSON.stringify({ buildId, status: 'failed', message })}\n\n`);
    },
    close() {
      res.end();
    },
  };
}
