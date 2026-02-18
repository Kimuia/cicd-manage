import { buildService } from '@/entity/build';
import { buildDetailAdapter } from './build-detail.adapter';
import type { BuildDetailView } from './build-detail.type';

export async function getBuildDetail(buildId: string): Promise<BuildDetailView> {
  const build = await buildService.getById(buildId);
  return buildDetailAdapter.toUI(build);
}
