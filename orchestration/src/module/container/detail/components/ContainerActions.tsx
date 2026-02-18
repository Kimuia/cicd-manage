'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Square, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import {
  startContainerAction,
  stopContainerAction,
  restartContainerAction,
  deleteContainerAction,
} from '@/module/container/list/container-list.action';
import type { ContainerStatus } from '@/entity/container';

interface ContainerActionsProps {
  containerId: string;
  containerName: string;
  status: ContainerStatus;
}

export function ContainerActions({ containerId, containerName, status }: ContainerActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: (id: string) => Promise<unknown>) => {
    startTransition(async () => {
      await action(containerId);
      router.refresh();
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteContainerAction(containerId);
      router.push('/containers');
    });
  };

  return (
    <div className="flex gap-2">
      {status !== 'running' && (
        <Button size="sm" onClick={() => handleAction(startContainerAction)} disabled={isPending}>
          <Play className="mr-2 h-4 w-4" />
          시작
        </Button>
      )}
      {status === 'running' && (
        <Button size="sm" variant="outline" onClick={() => handleAction(stopContainerAction)} disabled={isPending}>
          <Square className="mr-2 h-4 w-4" />
          중지
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={() => handleAction(restartContainerAction)} disabled={isPending}>
        <RotateCcw className="mr-2 h-4 w-4" />
        재시작
      </Button>
      <ConfirmDialog
        trigger={
          <Button size="sm" variant="outline" disabled={isPending}>
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        }
        title="컨테이너 삭제"
        description={`"${containerName}" 컨테이너를 삭제하시겠습니까?`}
        confirmLabel="삭제"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
