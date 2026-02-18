import { dockerLoad } from './docker-load.js';
import { dockerRun, healthCheck } from './docker-run.js';
import type { DeployRequest, SSEWriter } from '../types.js';

/**
 * 배포 파이프라인 오케스트레이터
 * 1. Docker Load → 2. Docker Run → 3. Health Check
 */
export async function runDeployPipeline(request: DeployRequest, sse: SSEWriter): Promise<void> {
  try {
    sse.sendProgress('queued', 0, `배포 시작: ${request.deploymentId}`);

    // 1. Docker Load
    await dockerLoad({ tarPath: request.imageTarPath }, sse);

    // 2. Docker Run
    const containerId = await dockerRun({
      imageName: request.imageName,
      containerName: request.containerName,
      portMappings: request.portMappings,
      envVars: request.envVars,
    }, sse);

    // 3. Health Check
    await healthCheck(containerId, sse);

    sse.sendProgress('complete', 100, '배포 완료');
    sse.sendComplete(containerId);
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류';
    console.error(`배포 실패 [${request.deploymentId}]:`, message);
    sse.sendError(message);
  }
}
