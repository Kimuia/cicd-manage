import type { BuildStatus } from './build.schema';

export const BUILD_TAGS = {
  list: 'builds',
  detail: (id: string) => `build-${id}`,
  all: (id?: string) => (id ? ['builds', `build-${id}`] : ['builds']),
} as const;

export const BUILD_STATUS_LABEL: Record<BuildStatus, string> = {
  pending: '대기',
  queued: '대기열',
  running: '빌드 중',
  success: '성공',
  failed: '실패',
  cancelled: '취소',
} as const;

export const BUILD_STATUS_VARIANT: Record<BuildStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  queued: 'secondary',
  running: 'default',
  success: 'default',
  failed: 'destructive',
  cancelled: 'outline',
} as const;
