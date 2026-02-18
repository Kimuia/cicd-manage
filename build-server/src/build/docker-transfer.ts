import path from 'node:path';
import fs from 'node:fs/promises';
import { createWriteStream, createReadStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { Client } from 'ssh2';
import { docker } from '../docker/client.js';
import { config } from '../config.js';
import type { SSEWriter } from '../types.js';

interface DockerSaveOptions {
  imageName: string;
  buildId: string;
}

interface ScpTransferOptions {
  host: string;
  port: number;
  username: string;
  privateKeyPath: string;
  targetDir: string;
}

/** Docker 이미지를 tar 파일로 저장 */
export async function dockerSave(options: DockerSaveOptions, sse: SSEWriter): Promise<string> {
  const tarPath = path.join(config.workDir, `${options.buildId}.tar`);

  sse.sendProgress('saving', 65, `이미지 저장 중: ${options.imageName}`);

  const image = docker.getImage(options.imageName);
  const imageStream = await image.get();
  const fileStream = createWriteStream(tarPath);

  await pipeline(imageStream, fileStream);

  sse.sendProgress('saving', 75, '이미지 tar 저장 완료');
  return tarPath;
}

/** tar 파일을 gzip 압축하여 .tar.gz 생성 */
export async function gzipCompress(tarPath: string, sse: SSEWriter): Promise<string> {
  const gzPath = `${tarPath}.gz`;

  const stat = await fs.stat(tarPath);
  const originalSize = stat.size;
  sse.sendProgress('compressing', 73, `gzip 압축 중 (원본: ${Math.round(originalSize / 1024 / 1024)}MB)`);

  await pipeline(
    createReadStream(tarPath),
    createGzip(),
    createWriteStream(gzPath),
  );

  const gzStat = await fs.stat(gzPath);
  const ratio = Math.round((1 - gzStat.size / originalSize) * 100);
  sse.sendProgress('compressing', 77, `압축 완료 (${Math.round(gzStat.size / 1024 / 1024)}MB, ${ratio}% 감소)`);

  return gzPath;
}

/** SSH2를 통해 파일을 배포 서버로 SCP 전송 */
export async function scpTransfer(tarPath: string, options: ScpTransferOptions, sse: SSEWriter): Promise<void> {
  sse.sendProgress('transferring', 78, `배포 서버로 전송 중: ${options.host}`);

  let privateKey: Buffer;
  try {
    privateKey = await fs.readFile(options.privateKeyPath);
  } catch {
    throw new Error(`개인키 읽기 실패: ${options.privateKeyPath}`);
  }

  const fileName = path.basename(tarPath);
  const remotePath = path.posix.join(options.targetDir, fileName);

  const stat = await fs.stat(tarPath);
  const totalBytes = stat.size;

  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
        if (err) {
          conn.end();
          reject(new Error(`SFTP 오류: ${err.message}`));
          return;
        }

        const readStream = createReadStream(tarPath);
        const writeStream = sftp.createWriteStream(remotePath);

        let transferred = 0;

        readStream.on('data', (chunk: string | Buffer) => {
          const len = typeof chunk === 'string' ? Buffer.byteLength(chunk) : chunk.length;
          transferred += len;
          const pct = 78 + Math.round((transferred / totalBytes) * 12);
          sse.sendProgress('transferring', Math.min(pct, 90), `전송 중 ${Math.round(transferred / 1024 / 1024)}MB / ${Math.round(totalBytes / 1024 / 1024)}MB`);
        });

        writeStream.on('close', () => {
          sse.sendProgress('transferring', 90, '전송 완료');
          conn.end();
          resolve();
        });

        writeStream.on('error', (writeErr: Error) => {
          conn.end();
          reject(new Error(`SFTP 쓰기 오류: ${writeErr.message}`));
        });

        readStream.pipe(writeStream);
      });
    });

    conn.on('error', (connErr) => {
      reject(new Error(`SSH 연결 오류: ${connErr.message}`));
    });

    conn.connect({
      host: options.host,
      port: options.port,
      username: options.username,
      privateKey,
    });
  });
}

/** tar 파일 삭제 */
export async function cleanupTar(tarPath: string): Promise<void> {
  try {
    await fs.unlink(tarPath);
  } catch {
    console.warn(`tar 파일 정리 실패: ${tarPath}`);
  }
}
