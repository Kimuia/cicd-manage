import path from 'node:path';
import fs from 'node:fs/promises';
import simpleGit from 'simple-git';
import { config } from '../config.js';
import type { SSEWriter } from '../types.js';

interface GitCloneOptions {
  gitUrl: string;
  gitBranch: string;
  gitCommit?: string;
  buildId: string;
}

/** Git 저장소를 지정 브랜치로 shallow clone */
export async function gitClone(options: GitCloneOptions, sse: SSEWriter): Promise<string> {
  const cloneDir = path.join(config.workDir, options.buildId);

  await fs.mkdir(cloneDir, { recursive: true });

  sse.sendProgress('cloning', 10, `저장소 클론 중: ${options.gitUrl} (브랜치: ${options.gitBranch})`);

  const git = simpleGit();

  await git.clone(options.gitUrl, cloneDir, [
    '--single-branch',
    '--branch', options.gitBranch,
    '--depth', '1',
  ]);

  if (options.gitCommit) {
    const repoGit = simpleGit(cloneDir);
    await repoGit.checkout(options.gitCommit);
    sse.sendProgress('cloning', 18, `커밋 체크아웃 완료: ${options.gitCommit}`);
  }

  sse.sendProgress('cloning', 20, '클론 완료');

  return cloneDir;
}

/** 클론된 디렉토리 삭제 */
export async function cleanupClone(cloneDir: string): Promise<void> {
  try {
    await fs.rm(cloneDir, { recursive: true, force: true });
  } catch {
    console.warn(`클론 디렉토리 정리 실패: ${cloneDir}`);
  }
}
