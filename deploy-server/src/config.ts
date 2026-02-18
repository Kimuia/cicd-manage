import { v4 as uuidv4 } from 'uuid';
import os from 'node:os';
import path from 'node:path';

/** 배포 서버 설정 - 환경변수로 오버라이드 가능 */
export const config = {
  port: Number(process.env.PORT) || 4002,
  orchestrationUrl: process.env.ORCHESTRATION_URL || 'http://localhost:3000',
  agentId: process.env.AGENT_ID || `deploy_${uuidv4().slice(0, 8)}`,
  agentType: 'deploy' as const,
  imageDir: process.env.IMAGE_DIR || path.join(os.tmpdir(), 'deploy-server', 'images'),
  heartbeatIntervalMs: 30_000,
} as const;
