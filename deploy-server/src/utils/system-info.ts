import os from 'node:os';
import { execSync } from 'node:child_process';
import { docker } from '../docker/client.js';

/** 호스트명 조회 */
export function getHostname(): string {
  return os.hostname();
}

/** 외부 네트워크 IPv4 주소 조회 */
export function getIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const nets of Object.values(interfaces)) {
    if (!nets) continue;
    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

/** Docker 버전 문자열 조회 */
export async function getDockerVersion(): Promise<string> {
  try {
    const info = await docker.version();
    return `Docker version ${info.Version}, build ${info.GitCommit}`;
  } catch {
    return 'not installed';
  }
}

/** 전체 메모리 (bytes) */
export function getTotalMemory(): number {
  return os.totalmem();
}

/** 남은 디스크 공간 (bytes) */
export function getFreeDisk(): number {
  try {
    const output = execSync("df -k / | tail -1 | awk '{print $4}'", { encoding: 'utf-8' }).trim();
    return parseInt(output, 10) * 1024;
  } catch {
    return 0;
  }
}

/** CPU 사용률 (%) */
export function getCpuUsage(): number {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;
  for (const cpu of cpus) {
    const { user, nice, sys, idle, irq } = cpu.times;
    totalTick += user + nice + sys + idle + irq;
    totalIdle += idle;
  }
  return Math.round((1 - totalIdle / totalTick) * 100 * 10) / 10;
}

/** 메모리 사용률 (%) */
export function getMemoryUsage(): number {
  const total = os.totalmem();
  const free = os.freemem();
  return Math.round(((total - free) / total) * 100 * 10) / 10;
}

/** 디스크 사용률 (%) */
export function getDiskUsage(): number {
  try {
    const output = execSync("df -k / | tail -1 | awk '{print $5}'", { encoding: 'utf-8' }).trim();
    return parseFloat(output.replace('%', ''));
  } catch {
    return 0;
  }
}
