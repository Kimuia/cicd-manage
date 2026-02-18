import { containerService } from '@/entity/container';
import { containerDetailAdapter } from './container-detail.adapter';
import type { ContainerDetailView } from './container-detail.type';

export async function getContainerDetail(containerId: string): Promise<ContainerDetailView> {
  const container = await containerService.getById(containerId);
  return containerDetailAdapter.toUI(container);
}
