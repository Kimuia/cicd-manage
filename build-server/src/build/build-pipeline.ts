import { config } from '../config.js';
import { gitClone, cleanupClone } from './git-clone.js';
import { dockerBuild } from './docker-build.js';
import { dockerSave, gzipCompress, scpTransfer, cleanupTar } from './docker-transfer.js';
import type { BuildRequest, SSEWriter } from '../types.js';

/**
 * 빌드 파이프라인 오케스트레이터
 * 1. Git Clone → 2. Docker Build → 3. Docker Save → 4. gzip 압축 → 5. SCP 전송 → 6. 정리
 */
export async function runBuildPipeline(request: BuildRequest, sse: SSEWriter): Promise<void> {
  let cloneDir: string | null = null;
  let tarPath: string | null = null;
  let gzPath: string | null = null;

  try {
    sse.sendProgress('queued', 0, `빌드 시작: ${request.buildId}`);

    // 1. Git Clone
    cloneDir = await gitClone({
      gitUrl: request.gitUrl,
      gitBranch: request.gitBranch,
      gitCommit: request.gitCommit,
      buildId: request.buildId,
    }, sse);

    // 2. Docker Build
    const fullImageName = await dockerBuild({
      cloneDir,
      dockerfilePath: request.dockerfilePath,
      imageName: request.imageName,
      imageTag: request.imageTag,
      buildArgs: request.buildArgs,
    }, sse);

    // 3. Docker Save
    tarPath = await dockerSave({
      imageName: fullImageName,
      buildId: request.buildId,
    }, sse);

    // 4. gzip 압축
    gzPath = await gzipCompress(tarPath, sse);

    // 5. SCP 전송 (배포 서버가 설정된 경우만)
    if (config.deployServer.host) {
      await scpTransfer(gzPath, {
        host: config.deployServer.host,
        port: config.deployServer.port,
        username: config.deployServer.username,
        privateKeyPath: config.deployServer.privateKeyPath,
        targetDir: config.deployServer.targetDir,
      }, sse);
    } else {
      sse.sendProgress('transferring', 90, 'SCP 전송 생략 (배포 서버 미설정)');
    }

    // 6. 정리
    sse.sendProgress('cleanup', 95, '임시 파일 정리 중');

    if (gzPath) await cleanupTar(gzPath);
    if (tarPath) await cleanupTar(tarPath);
    if (cloneDir) await cleanupClone(cloneDir);

    sse.sendProgress('complete', 100, '빌드 완료');
    sse.sendComplete(`${request.imageName}:${request.imageTag}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류';
    console.error(`빌드 실패 [${request.buildId}]:`, message);
    sse.sendError(message);

    // 오류 발생 시 정리
    if (gzPath) await cleanupTar(gzPath);
    if (tarPath) await cleanupTar(tarPath);
    if (cloneDir) await cleanupClone(cloneDir);
  }
}
