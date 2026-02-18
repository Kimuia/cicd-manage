import express from 'express';
import { docker } from './docker/client.js';
import { config } from './config.js';
import { registerAgent, startHeartbeat, addCurrentJob, removeCurrentJob } from './agent.js';
import { createSSEWriter } from './types.js';
import { runDeployPipeline } from './deploy/deploy-pipeline.js';
import { streamContainerLogs } from './deploy/container-logs.js';
import type { DeployRequest } from './types.js';

const app = express();

app.use(express.json());

/** 헬스체크 엔드포인트 */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    agentId: config.agentId,
    agentType: config.agentType,
  });
});

/** 배포 요청 엔드포인트 - SSE로 진행 상황 실시간 전송 */
app.post('/deploy', (req, res) => {
  const deployReq = req.body as DeployRequest;

  if (!deployReq.deploymentId || !deployReq.imageName || !deployReq.containerName) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: '필수 필드 누락: deploymentId, imageName, containerName' } });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const sse = createSSEWriter(res, deployReq.deploymentId);

  addCurrentJob(deployReq.deploymentId);

  runDeployPipeline(deployReq, sse).finally(() => {
    removeCurrentJob(deployReq.deploymentId);
    sse.close();
  });
});

/** 전체 컨테이너 목록 조회 */
app.get('/containers', async (_req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    const result = containers.map((c) => ({
      id: c.Id.slice(0, 12),
      name: c.Names[0]?.replace(/^\//, '') ?? '',
      image: c.Image,
      status: c.Status,
      ports: c.Ports.map((p) => `${p.PublicPort ?? ''}:${p.PrivatePort}/${p.Type}`).join(', '),
    }));
    res.json({ containers: result });
  } catch {
    res.json({ containers: [] });
  }
});

/** 컨테이너 로그 스트리밍 (SSE) */
app.get('/containers/:id/logs', (req, res) => {
  const containerId = req.params.id;
  const tail = parseInt(req.query.tail as string, 10) || 100;
  const follow = req.query.follow !== 'false';

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  streamContainerLogs({ containerId, tail, follow }, res);
});

/** 컨테이너 중지 */
app.post('/containers/:id/stop', async (req, res) => {
  const containerId = req.params.id;
  try {
    const container = docker.getContainer(containerId);
    await container.stop();
    res.json({ status: 'stopped', containerId });
  } catch (err) {
    res.status(500).json({ error: { code: 'STOP_FAILED', message: (err as Error).message } });
  }
});

/** 컨테이너 재시작 */
app.post('/containers/:id/restart', async (req, res) => {
  const containerId = req.params.id;
  try {
    const container = docker.getContainer(containerId);
    await container.restart();
    res.json({ status: 'restarted', containerId });
  } catch (err) {
    res.status(500).json({ error: { code: 'RESTART_FAILED', message: (err as Error).message } });
  }
});

/** 컨테이너 삭제 */
app.delete('/containers/:id', async (req, res) => {
  const containerId = req.params.id;
  const force = req.query.force === 'true';
  try {
    const container = docker.getContainer(containerId);
    await container.remove({ force });
    res.json({ status: 'removed', containerId });
  } catch (err) {
    res.status(500).json({ error: { code: 'REMOVE_FAILED', message: (err as Error).message } });
  }
});

app.listen(config.port, async () => {
  console.log(`배포 서버 시작 - 포트: ${config.port} [${config.agentId}]`);
  await registerAgent();
  startHeartbeat();
});
