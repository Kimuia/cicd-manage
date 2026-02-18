import fs from 'node:fs';
import { docker } from '../docker/client.js';
import type { SSEWriter } from '../types.js';

interface DockerLoadOptions {
  tarPath: string;
}

/** tar 파일에서 Docker 이미지 로드 */
export async function dockerLoad(options: DockerLoadOptions, sse: SSEWriter): Promise<string> {
  sse.sendProgress('loading', 10, `이미지 로드 중: ${options.tarPath}`);

  const stream = fs.createReadStream(options.tarPath);
  const loadStream = await docker.loadImage(stream);

  const output = await new Promise<string>((resolve, reject) => {
    let result = '';
    loadStream.on('data', (chunk: Buffer) => {
      const parsed = JSON.parse(chunk.toString()) as { stream?: string };
      if (parsed.stream) {
        result += parsed.stream;
        sse.sendProgress('loading', 30, parsed.stream.trim());
      }
    });
    loadStream.on('end', () => resolve(result));
    loadStream.on('error', (err: Error) => reject(new Error(`Docker 이미지 로드 실패: ${err.message}`)));
  });

  const imageMatch = output.match(/Loaded image:\s*(.+)/);
  const imageName = imageMatch ? imageMatch[1].trim() : 'unknown';
  sse.sendProgress('loading', 40, `이미지 로드 완료: ${imageName}`);
  return imageName;
}
