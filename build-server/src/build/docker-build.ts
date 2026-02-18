import path from 'node:path';
import { docker } from '../docker/client.js';
import type { SSEWriter } from '../types.js';

interface DockerBuildOptions {
  cloneDir: string;
  dockerfilePath: string;
  imageName: string;
  imageTag: string;
  buildArgs?: Record<string, string>;
}

/** Dockerfile 기반 Docker 이미지 빌드 - 빌드 스트림에서 진행률 추출 */
export async function dockerBuild(options: DockerBuildOptions, sse: SSEWriter): Promise<string> {
  const fullImageName = `${options.imageName}:${options.imageTag}`;

  sse.sendProgress('building', 30, `이미지 빌드 중: ${fullImageName}`);

  const dockerfile = path.relative(options.cloneDir, options.dockerfilePath);

  const buildStream = await docker.buildImage(
    { context: options.cloneDir, src: ['.'] },
    {
      t: fullImageName,
      dockerfile,
      buildargs: options.buildArgs,
    },
  );

  let totalSteps = 0;
  let currentStep = 0;

  await new Promise<void>((resolve, reject) => {
    buildStream.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n').filter(Boolean);

      for (const raw of lines) {
        let parsed: { stream?: string; error?: string };
        try {
          parsed = JSON.parse(raw) as { stream?: string; error?: string };
        } catch {
          continue;
        }

        if (parsed.error) {
          reject(new Error(parsed.error.trim()));
          return;
        }

        const line = parsed.stream?.trim();
        if (!line) continue;

        // "Step N/M" 또는 "[stage N/M]" 패턴에서 진행률 추출
        const stepMatch = line.match(/Step\s+(\d+)\/(\d+)/i) ?? line.match(/\[.*?(\d+)\/(\d+)\]/);
        if (stepMatch) {
          currentStep = parseInt(stepMatch[1], 10);
          totalSteps = parseInt(stepMatch[2], 10);

          const stepProgress = 30 + Math.round((currentStep / totalSteps) * 30);
          sse.sendProgress('building', Math.min(stepProgress, 60), line);
        }
      }
    });

    buildStream.on('end', () => resolve());
    buildStream.on('error', (err: Error) => reject(new Error(`Docker 빌드 실패: ${err.message}`)));
  });

  sse.sendProgress('building', 60, 'Docker 빌드 완료');
  return fullImageName;
}
