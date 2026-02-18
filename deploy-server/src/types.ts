import type { Response } from 'express';

/** 에이전트 시스템 역량 정보 */
export interface AgentCapabilities {
  dockerVersion: string;
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

/** 배포 요청 입력 */
export interface DeployRequest {
  deploymentId: string;
  imageTarPath: string;
  imageName: string;
  containerName: string;
  portMappings: PortMapping[];
  envVars?: Record<string, string>;
}

/** 포트 매핑 (호스트:컨테이너) */
export interface PortMapping {
  host: number;
  container: number;
}

/** 배포 단계 */
export type DeployPhase =
  | 'queued'
  | 'loading'
  | 'running'
  | 'health_check'
  | 'complete'
  | 'error';

/** 배포 진행 상황 (SSE 이벤트 데이터) */
export interface DeployProgress {
  deploymentId: string;
  phase: DeployPhase;
  progress: number;
  message: string;
}

/** SSE 메시지 전송 인터페이스 */
export interface SSEWriter {
  sendProgress: (phase: DeployPhase, progress: number, message: string) => void;
  sendComplete: (containerId: string) => void;
  sendError: (message: string) => void;
  close: () => void;
}

/** SSE 응답 래퍼 생성 */
export function createSSEWriter(res: Response, deploymentId: string): SSEWriter {
  return {
    sendProgress(phase, progress, message) {
      const data: DeployProgress = { deploymentId, phase, progress, message };
      res.write(`event: progress\ndata: ${JSON.stringify(data)}\n\n`);
    },
    sendComplete(containerId) {
      res.write(`event: complete\ndata: ${JSON.stringify({ deploymentId, status: 'success', containerId })}\n\n`);
    },
    sendError(message) {
      res.write(`event: error\ndata: ${JSON.stringify({ deploymentId, status: 'failed', message })}\n\n`);
    },
    close() {
      res.end();
    },
  };
}
