import { buildService } from '@/entity/build';
import { buildListAdapter } from './build-list.adapter';
import type { BuildListView } from './build-list.type';

export async function getBuildList(): Promise<BuildListView[]> {
  const { builds } = await buildService.getList({ limit: 50 });
  return buildListAdapter.toUIList(builds);
}
