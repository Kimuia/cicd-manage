'use server';

import { revalidateTag } from 'next/cache';
import { containerService, CONTAINER_TAGS } from '@/entity/container';
import type { ActionResult } from '@/shared/model/action';

export async function startContainerAction(id: string): Promise<ActionResult<null>> {
  try {
    await containerService.start(id);
    revalidateTag(CONTAINER_TAGS.list);
    revalidateTag(CONTAINER_TAGS.detail(id));
    return { success: true, data: null };
  } catch (err) {
    return { success: false, data: null, error: 'SERVER_ERROR', message: (err as Error).message };
  }
}

export async function stopContainerAction(id: string): Promise<ActionResult<null>> {
  try {
    await containerService.stop(id);
    revalidateTag(CONTAINER_TAGS.list);
    revalidateTag(CONTAINER_TAGS.detail(id));
    return { success: true, data: null };
  } catch (err) {
    return { success: false, data: null, error: 'SERVER_ERROR', message: (err as Error).message };
  }
}

export async function restartContainerAction(id: string): Promise<ActionResult<null>> {
  try {
    await containerService.restart(id);
    revalidateTag(CONTAINER_TAGS.list);
    revalidateTag(CONTAINER_TAGS.detail(id));
    return { success: true, data: null };
  } catch (err) {
    return { success: false, data: null, error: 'SERVER_ERROR', message: (err as Error).message };
  }
}

export async function deleteContainerAction(id: string): Promise<ActionResult<null>> {
  try {
    await containerService.delete(id, true);
    revalidateTag(CONTAINER_TAGS.list);
    return { success: true, data: null };
  } catch (err) {
    return { success: false, data: null, error: 'SERVER_ERROR', message: (err as Error).message };
  }
}
