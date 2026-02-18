'use server';

import { revalidateTag } from 'next/cache';
import { projectService, PROJECT_TAGS } from '@/entity/project';
import { projectFormAdapter } from './project-form.adapter';
import { projectFormSchema } from './project-form.type';
import type { ActionResult } from '@/shared/model/action';

export async function createProjectAction(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = projectFormSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      error: 'VALIDATION_ERROR',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await projectService.create(projectFormAdapter.toCreateRequest(parsed.data));
    revalidateTag(PROJECT_TAGS.list);
    return { success: true, data: { id: result.id } };
  } catch (err) {
    return { success: false, data: null, error: 'SERVER_ERROR', message: (err as Error).message };
  }
}

export async function updateProjectAction(id: string, formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = projectFormSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      error: 'VALIDATION_ERROR',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await projectService.update(id, projectFormAdapter.toUpdateRequest(parsed.data));
    revalidateTag(PROJECT_TAGS.list);
    revalidateTag(PROJECT_TAGS.detail(id));
    return { success: true, data: { id: result.id } };
  } catch (err) {
    return { success: false, data: null, error: 'SERVER_ERROR', message: (err as Error).message };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult<null>> {
  try {
    await projectService.delete(id);
    revalidateTag(PROJECT_TAGS.list);
    return { success: true, data: null };
  } catch (err) {
    return { success: false, data: null, error: 'SERVER_ERROR', message: (err as Error).message };
  }
}
