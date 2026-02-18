import type { ContainerStatus, ContainerHealth } from './container.schema';

export const CONTAINER_TAGS = {
  list: 'containers',
  detail: (id: string) => `container-${id}`,
  all: (id?: string) => (id ? ['containers', `container-${id}`] : ['containers']),
} as const;

export const CONTAINER_STATUS_LABEL: Record<ContainerStatus, string> = {
  created: '생성됨',
  running: '실행 중',
  paused: '일시중지',
  restarting: '재시작 중',
  exited: '종료',
  dead: '비정상 종료',
} as const;

export const CONTAINER_STATUS_VARIANT: Record<ContainerStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  created: 'secondary',
  running: 'default',
  paused: 'outline',
  restarting: 'secondary',
  exited: 'outline',
  dead: 'destructive',
} as const;

export const CONTAINER_HEALTH_LABEL: Record<ContainerHealth, string> = {
  none: '-',
  starting: '시작 중',
  healthy: '정상',
  unhealthy: '비정상',
} as const;
