import { containerService } from '@/entity/container';
import { containerListAdapter } from './container-list.adapter';
import type { ContainerListView } from './container-list.type';

export async function getContainerList(): Promise<ContainerListView[]> {
  const { containers } = await containerService.getList({ limit: 50 });
  return containerListAdapter.toUIList(containers);
}
