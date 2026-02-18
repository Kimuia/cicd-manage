'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { deleteProjectAction } from '@/module/project/form';

interface DeleteProjectButtonProps {
  projectId: string;
}

export function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProjectAction(projectId);
      if (result.success) {
        router.push('/projects');
      }
    });
  };

  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline" size="sm" disabled={isPending}>
          <Trash2 className="mr-2 h-4 w-4" />
          삭제
        </Button>
      }
      title="프로젝트 삭제"
      description="이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      confirmLabel="삭제"
      variant="destructive"
      onConfirm={handleDelete}
    />
  );
}
