import { docker } from '../docker/client.js';
import type { Response } from 'express';
import type { Readable } from 'node:stream';

interface ContainerLogOptions {
  containerId: string;
  tail?: number;
  follow?: boolean;
}

/** 컨테이너 로그를 SSE로 실시간 스트리밍 */
export async function streamContainerLogs(options: ContainerLogOptions, res: Response): Promise<void> {
  const { containerId, tail = 100, follow = true } = options;

  const container = docker.getContainer(containerId);

  const logStream = await container.logs({
    stdout: true,
    stderr: true,
    follow: follow as true,
    tail,
    timestamps: true,
  }) as Readable;

  // dockerode 멀티플렉스 스트림 파싱: 첫 8바이트가 헤더 (스트림 타입 + 크기)
  const demuxStream = (chunk: Buffer) => {
    const headerSize = 8;
    let offset = 0;

    while (offset + headerSize <= chunk.length) {
      const streamType = chunk[offset] === 1 ? 'stdout' : 'stderr';
      const size = chunk.readUInt32BE(offset + 4);
      offset += headerSize;

      if (offset + size > chunk.length) break;

      const message = chunk.subarray(offset, offset + size).toString().trim();
      offset += size;

      if (message) {
        res.write(`data: ${JSON.stringify({ timestamp: new Date().toISOString(), stream: streamType, message })}\n\n`);
      }
    }
  };

  logStream.on('data', demuxStream);

  logStream.on('end', () => {
    res.write(`event: end\ndata: ${JSON.stringify({ message: '로그 스트림 종료' })}\n\n`);
    res.end();
  });

  logStream.on('error', (err: Error) => {
    res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
    res.end();
  });

  res.on('close', () => {
    logStream.destroy();
  });
}
