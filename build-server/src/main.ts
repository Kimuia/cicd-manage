import express from 'express';
import { config } from './config.js';
import { registerAgent, startHeartbeat } from './agent.js';
import { createSSEWriter } from './types.js';
import { addCurrentJob, removeCurrentJob } from './agent.js';
import { runBuildPipeline } from './build/build-pipeline.js';
import type { BuildRequest } from './types.js';

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

/** 빌드 요청 엔드포인트 - SSE로 진행 상황 실시간 전송 */
app.post('/build', (req, res) => {
  const buildReq = req.body as BuildRequest;

  if (!buildReq.buildId || !buildReq.gitUrl || !buildReq.imageName) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: '필수 필드 누락: buildId, gitUrl, imageName' } });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const sse = createSSEWriter(res, buildReq.buildId);

  addCurrentJob(buildReq.buildId);

  runBuildPipeline(buildReq, sse).finally(() => {
    removeCurrentJob(buildReq.buildId);
    sse.close();
  });
});

app.listen(config.port, async () => {
  console.log(`빌드 서버 시작 - 포트: ${config.port} [${config.agentId}]`);
  await registerAgent();
  startHeartbeat();
});
