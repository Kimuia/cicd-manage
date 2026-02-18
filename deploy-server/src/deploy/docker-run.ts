import { docker } from '../docker/client.js';
import type { PortMapping, SSEWriter } from '../types.js';

interface DockerRunOptions {
  imageName: string;
  containerName: string;
  portMappings: PortMapping[];
  envVars?: Record<string, string>;
}

/** Docker 컨테이너 생성 및 실행 */
export async function dockerRun(options: DockerRunOptions, sse: SSEWriter): Promise<string> {
  sse.sendProgress('running', 50, `컨테이너 시작 중: ${options.containerName}`);

  // 동일 이름의 기존 컨테이너가 있으면 강제 삭제
  try {
    const existing = docker.getContainer(options.containerName);
    await existing.remove({ force: true });
  } catch {
    // 기존 컨테이너 없음 - 정상
  }

  const portBindings: Record<string, { HostPort: string }[]> = {};
  const exposedPorts: Record<string, object> = {};

  for (const pm of options.portMappings) {
    const containerPort = `${pm.container}/tcp`;
    exposedPorts[containerPort] = {};
    portBindings[containerPort] = [{ HostPort: String(pm.host) }];
  }

  const env = options.envVars
    ? Object.entries(options.envVars).map(([key, value]) => `${key}=${value}`)
    : [];

  const container = await docker.createContainer({
    Image: options.imageName,
    name: options.containerName,
    Env: env,
    ExposedPorts: exposedPorts,
    HostConfig: {
      PortBindings: portBindings,
    },
  });

  await container.start();

  const shortId = container.id.slice(0, 12);
  sse.sendProgress('running', 70, `컨테이너 실행 완료: ${shortId}`);
  return shortId;
}

/** 컨테이너 헬스체크 - 실행 상태 확인 */
export async function healthCheck(containerId: string, sse: SSEWriter): Promise<void> {
  sse.sendProgress('health_check', 80, `컨테이너 상태 확인 중: ${containerId}`);

  // 컨테이너 시작 대기
  await new Promise((r) => setTimeout(r, 2000));

  const container = docker.getContainer(containerId);
  const info = await container.inspect();

  if (info.State.Running) {
    sse.sendProgress('health_check', 90, '컨테이너 정상 실행 중');
  } else {
    throw new Error(`컨테이너가 실행 중이 아닙니다 (상태: ${info.State.Status})`);
  }
}
