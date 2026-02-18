import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';
import os from 'node:os';

/** 빌드 서버 설정 - 환경변수로 오버라이드 가능 */
export const config = {
  port: Number(process.env.PORT) || 4001,
  orchestrationUrl: process.env.ORCHESTRATION_URL || 'http://localhost:3000',
  agentId: process.env.AGENT_ID || `build_${uuidv4().slice(0, 8)}`,
  agentType: 'build' as const,
  workDir: process.env.WORK_DIR || path.join(os.tmpdir(), 'build-server'),
  heartbeatIntervalMs: 30_000,
  /** 배포 서버 SSH 접속 정보 (SCP 전송용) */
  deployServer: {
    host: process.env.DEPLOY_HOST || '',
    port: Number(process.env.DEPLOY_SSH_PORT) || 22,
    username: process.env.DEPLOY_USER || 'root',
    privateKeyPath: process.env.DEPLOY_KEY_PATH || '',
    targetDir: process.env.DEPLOY_TARGET_DIR || '/tmp',
  },
} as const;
