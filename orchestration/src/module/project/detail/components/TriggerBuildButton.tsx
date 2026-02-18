'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildService } from '@/entity/build';

interface TriggerBuildButtonProps {
  projectId: string;
}

export function TriggerBuildButton({ projectId }: TriggerBuildButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleTrigger = () => {
    startTransition(async () => {
      try {
        const result = await buildService.trigger(projectId);
        router.push(`/builds/${result.buildId}`);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  return (
    <div>
      <Button onClick={handleTrigger} disabled={isPending} size="sm">
        <Hammer className="mr-2 h-4 w-4" />
        {isPending ? '빌드 시작 중...' : '빌드 시작'}
      </Button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
