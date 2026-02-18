'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
      <h2 className="text-lg font-medium">오류가 발생했습니다</h2>
      <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-4" variant="outline">
        다시 시도
      </Button>
    </div>
  );
}
