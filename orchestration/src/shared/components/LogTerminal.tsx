'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/shared/utils/cn';

interface LogTerminalProps {
  logs: string[];
  className?: string;
  autoScroll?: boolean;
}

export function LogTerminal({ logs, className, autoScroll = true }: LogTerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.length, autoScroll]);

  return (
    <ScrollArea className={cn('h-80 rounded-md border bg-zinc-950 p-4', className)}>
      <pre className="font-mono text-xs leading-relaxed text-zinc-200">
        {logs.length === 0 ? (
          <span className="text-zinc-500">로그가 없습니다.</span>
        ) : (
          logs.map((line, i) => (
            <div key={i} className="hover:bg-zinc-800/50">
              <span className="mr-3 inline-block w-8 select-none text-right text-zinc-600">{i + 1}</span>
              {line}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </pre>
    </ScrollArea>
  );
}
