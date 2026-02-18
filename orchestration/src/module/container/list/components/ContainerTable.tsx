'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Play, Square, RotateCcw, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { TimeAgo } from '@/shared/components/TimeAgo';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { CONTAINER_STATUS_LABEL, CONTAINER_STATUS_VARIANT, CONTAINER_HEALTH_LABEL } from '@/entity/container';
import {
  startContainerAction,
  stopContainerAction,
  restartContainerAction,
  deleteContainerAction,
} from '../container-list.action';
import type { ContainerListView } from '../container-list.type';

interface ContainerTableProps {
  containers: ContainerListView[];
}

export function ContainerTable({ containers }: ContainerTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: (id: string) => Promise<unknown>, id: string) => {
    startTransition(async () => {
      await action(id);
      router.refresh();
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이미지</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>헬스</TableHead>
          <TableHead>포트</TableHead>
          <TableHead>생성일</TableHead>
          <TableHead className="w-40">액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {containers.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <Link href={`/containers/${c.id}`} className="font-medium hover:underline">
                {c.name}
              </Link>
            </TableCell>
            <TableCell className="font-mono text-xs">{c.image}</TableCell>
            <TableCell>
              <StatusBadge
                label={CONTAINER_STATUS_LABEL[c.status]}
                variant={CONTAINER_STATUS_VARIANT[c.status]}
              />
            </TableCell>
            <TableCell className="text-sm">{CONTAINER_HEALTH_LABEL[c.health]}</TableCell>
            <TableCell className="font-mono text-xs">
              {c.ports.map((p) => `${p.host}:${p.container}`).join(', ') || '-'}
            </TableCell>
            <TableCell><TimeAgo date={c.createdAt} className="text-sm" /></TableCell>
            <TableCell>
              <div className="flex gap-1">
                {c.status !== 'running' && (
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => handleAction(startContainerAction, c.id)}
                    disabled={isPending}
                    title="시작"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                )}
                {c.status === 'running' && (
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => handleAction(stopContainerAction, c.id)}
                    disabled={isPending}
                    title="중지"
                  >
                    <Square className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => handleAction(restartContainerAction, c.id)}
                  disabled={isPending}
                  title="재시작"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isPending} title="삭제">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  }
                  title="컨테이너 삭제"
                  description={`"${c.name}" 컨테이너를 삭제하시겠습니까?`}
                  confirmLabel="삭제"
                  variant="destructive"
                  onConfirm={() => handleAction(deleteContainerAction, c.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
