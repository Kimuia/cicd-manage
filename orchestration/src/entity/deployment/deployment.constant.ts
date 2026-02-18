import type { DeploymentStatus } from './deployment.schema';

export const DEPLOYMENT_TAGS = {
  list: 'deployments',
  detail: (id: string) => `deployment-${id}`,
  all: (id?: string) => (id ? ['deployments', `deployment-${id}`] : ['deployments']),
} as const;

export const DEPLOYMENT_STATUS_LABEL: Record<DeploymentStatus, string> = {
  pending: '대기',
  deploying: '배포 중',
  running: '실행 중',
  stopped: '중지',
  failed: '실패',
} as const;

export const DEPLOYMENT_STATUS_VARIANT: Record<DeploymentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  deploying: 'default',
  running: 'default',
  stopped: 'outline',
  failed: 'destructive',
} as const;
